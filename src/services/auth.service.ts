import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { TokenBlacklistService } from './token-blacklist.service';
import { ProfileService } from './profile.service';
import { ParentService } from './parent.service';
import { StaffService } from './staff.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '@/decorations/dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private tokenBlacklistService: TokenBlacklistService,
    private profileService: ProfileService,
    private parentService: ParentService,
    private staffService: StaffService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }
  
  async login(user: any) {
    let permissions: string[] = [];
    if (
      user.roleId &&
      typeof user.roleId === 'object' &&
      'permissions' in user.roleId
    ) {
      const rolePermissions = user.roleId.permissions;
      if (Array.isArray(rolePermissions)) {
        permissions = rolePermissions;
      }
    }

    // Xác định loại user: parent hay staff
    let userType = 'user';
    const parent = await this.parentService.findByUserId(user._id.toString());
    if (parent) {
      userType = 'parent';
    } else {
      const staff = await this.staffService.findByUserId(user._id.toString());
      if (staff) {
        userType = 'staff';
      }
    }

    const payload = {
      email: user.email,
      sub: user._id,
      role: user.role,
      permissions: permissions,
      userType: userType,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.userService.updateRefreshToken(user._id, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        permissions: permissions,
        userType: userType,
      },
    };
  }
  
  async register(registerDto: RegisterDto) {
    // Create user
    const user = await this.userService.create(
      registerDto.email,
      registerDto.password,
      registerDto.role,
    );

    return user;
  }

  async logout(userId: string, token?: string) {
    // Update user's refresh token to null
    await this.userService.updateRefreshToken(userId, null);

    // Add the token to the blacklist if provided
    if (token) {
      // Get the token expiration by decoding it
      try {
        const decoded = this.jwtService.decode(token);
        if (decoded && typeof decoded === 'object' && decoded.exp) {
          // Calculate remaining seconds until expiration
          const currentTime = Math.floor(Date.now() / 1000);
          const expiresIn = Math.max(0, decoded.exp - currentTime);

          // Add to blacklist
          await this.tokenBlacklistService.blacklistToken(token, expiresIn);
        }
      } catch (error) {
        console.error('Error blacklisting token:', error);
      }
    }

    return { success: true, message: 'Đăng xuất thành công' };
  }
  
  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);

    if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    } 
    
    // Get permissions from role if available
    // Use optional chaining and check if roleId is populated
    let permissions: string[] = [];
    if (
      user.roleId &&
      typeof user.roleId === 'object' &&
      'permissions' in user.roleId
    ) {
      const rolePermissions = user.roleId.permissions;
      if (Array.isArray(rolePermissions)) {
        permissions = rolePermissions;
      }
    }

    const payload = {
      email: user.email,
      sub: user._id,
      permissions: permissions,
    };
    const accessToken = this.jwtService.sign(payload);
    return {
      access_token: accessToken,
      user: {
        id: user._id,
        email: user.email,
      },
    };
  }
}
