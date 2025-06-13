import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { TokenBlacklistService } from './token-blacklist.service';
import { ProfileService } from './profile.service';
import { ParentService } from './parent.service';
import { StaffService } from './staff.service';
import { AdminService } from './admin.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '@/decorations/dto/register.dto';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private tokenBlacklistService: TokenBlacklistService,
    private profileService: ProfileService,
    private parentService: ParentService,
    private staffService: StaffService,
    private adminService: AdminService,
    private otpService: OtpService,
  ) {}

  async sendLoginOTP(email: string): Promise<void> {
    await this.otpService.createOTP(email);
  }

  async verifyLoginOTP(email: string, otp: string): Promise<boolean> {
    return this.otpService.verifyOTP(email, otp);
  }

  async validateUser(
    email: string,
    password: string,
    role: string,
  ): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const userId = user.userId.toString(); // Assuming '_id' is the correct property name
    if (!userId) {
      throw new UnauthorizedException('Lỗi xác thực người dùng');
    }

    // Get user with populated role information
    const userWithRole = await this.userService.findByEmailWithRole(email);
    const userRole = userWithRole?.roleId as any;
    const roleName = userRole?.name; // For staff login
    if (role === 'staff') {
      // Allow both admin and staff roles to log in as staff
      if (!roleName || (roleName !== 'admin' && roleName !== 'staff')) {
        throw new UnauthorizedException(
          'Tài khoản không có quyền truy cập với vai trò staff',
        );
      }

      const staffProfile = await this.staffService.findByUserId(userId);
      if (!staffProfile) {
        throw new UnauthorizedException('Không tìm thấy thông tin nhân viên');
      }
    }
    // For admin login
    else if (role === 'admin') {
      if (!roleName || roleName !== 'admin') {
        throw new UnauthorizedException(
          'Tài khoản không có quyền truy cập với vai trò admin',
        );
      }

      const staffProfile = await this.staffService.findByUserId(userId);
      if (!staffProfile) {
        throw new UnauthorizedException('Không tìm thấy thông tin nhân viên');
      }
    }
    // For parent login
    else if (role === 'parent') {
      const parentProfile = await this.parentService.findByUserId(userId);
      if (!parentProfile) {
        throw new UnauthorizedException('Không tìm thấy thông tin phụ huynh');
      }
    } else {
      throw new UnauthorizedException('Vai trò không hợp lệ');
    }

    const { password: _, ...result } = user;
    return result;
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

    // Xác định loại user: parent, staff, hoặc admin
    let userType = 'user';
    const parent = await this.parentService.findByUserId(user._id.toString());
    if (parent) {
      userType = 'parent';
    } else {
      const staff = await this.staffService.findByUserId(user._id.toString());
      if (staff) {
        // Check if user has admin role
        const userWithRole = await this.userService.findByEmailWithRole(
          user.email,
        );
        const userRole = userWithRole?.roleId as any;
        const roleName = userRole?.name;
        userType = roleName === 'admin' ? 'admin' : 'staff';
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

    // Lấy thông tin profile
    const profile = await this.profileService.findByUserId(user._id);

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
      profile: profile,
    };
  }
  async register(registerDto: RegisterDto) {
    // Create user
    const user = await this.userService.create(registerDto);

    // Get role information
    const userWithRole = await this.userService.findByEmailWithRole(
      registerDto.email,
    );
    const userRole = userWithRole?.roleId as any;
    const roleName = userRole?.name;

    if (roleName === 'admin') {
      // Create admin record
      await this.adminService.create({
        userId: user._id,
      } as any);
    } else if (roleName === 'staff') {
      // Create staff record
      await this.staffService.create({
        userId: user._id,
        position: 'staff',
      });
    }

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

    if (!user || !user.refresh_token || user.refresh_token !== refreshToken) {
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

  async validateRefreshToken(refreshToken: string) {
    const user = await this.userService.findByRefreshToken(refreshToken);
    if (!user || !user.refresh_token || user.refresh_token !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
