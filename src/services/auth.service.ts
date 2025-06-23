import { UserService } from '@/services/user.service';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@/schemas/user.schema';
import { CreateUserDto } from '@/decorations/dto/create-user.dto';
import { UpdateUserDto } from '@/decorations/dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { OtpService } from './otp.service';
import { ParentService } from './parent.service';
import { StaffService } from './staff.service';
import { AdminService } from './admin.service';
import { ProfileService } from './profile.service';
import { TokenService } from './token-generator.service';
import { OAuth2Client } from 'google-auth-library';
import { ProfileDocument } from 'src/services/profile.service';

const googleClient = new OAuth2Client('485501319962-sh11atcehvgcfdfeoem7fv6igdqql6ud.apps.googleusercontent.com');


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private otpService: OtpService,
    private parentService: ParentService,
    private staffService: StaffService,
    private adminService: AdminService,
    private profileService: ProfileService,
    private tokenService: TokenService,
    private UserService: UserService,
  ) {}
  async register(createUserDto: CreateUserDto): Promise<User> {
    const exists = await this.userModel.findOne({ email: createUserDto.email });
    if (exists) throw new ConflictException('Email đã tồn tại');
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const created = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return created.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('Không tìm thấy user');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    const updated = await this.userModel
      .findByIdAndUpdate(id, { ...updateUserDto, updated_at: new Date() }, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Không tìm thấy user');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.userModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Không tìm thấy user');
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new UnauthorizedException('Sai email hoặc mật khẩu');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Sai email hoặc mật khẩu');
    return user;
  }

  async logout(user: string, token: string): Promise<void> {
    // Đảm bảo chỉ xóa refresh_token nếu token khớp
    await this.userModel
      .updateOne({ _id: user, refresh_token: token }, { refresh_token: null })
      .exec();
  }
  async loginParent(email: string, password: string): Promise<any> {
    const user = await this.validateUser(email, password);
    const user_id = (user as any)._id?.toString();
    const parent = await this.parentService.validateParent(user_id);
    if (!parent)
      throw new UnauthorizedException('Email này không được đăng ký làm tài khoản phụ huynh');
    await this.otpService.createOTP(email);
    // Return only status
    return {
      message: 'OTP đã được gửi đến email của bạn',
      email: email,
    };
  }
  async loginStaff(email: string, password: string): Promise<any> {
    const user = await this.validateUser(email, password);
    const user_id = (user as any)._id?.toString();
    const staff = await this.staffService.findByuser(user_id);
    if (!staff) throw new UnauthorizedException('Không phải tài khoản nhân viên');

    await this.otpService.createOTP(email);
    // Return only status
    return {
      message: 'OTP đã được gửi đến email của bạn',
      email: email,
    };
    // Generate tokens
  }
  async loginAdmin(email: string, password: string): Promise<any> {
    const user = await this.validateUser(email, password);
    const user_id = (user as any)._id?.toString();
    const admin = await this.adminService.findByuser(user_id);
    if (!admin) {
      throw new UnauthorizedException('Không phải tài khoản admin');
    }
    await this.otpService.createOTP(email);
    // Return only status
    return {
      message: 'OTP đã được gửi đến email của bạn',
      email: email,
    };
    // Generate tokens
  }

  // Parent login with OTP
  async loginParentWithOtp(email: string, otp: string): Promise<{ token: string }> {
    await this.otpService.verifyOTP(email, otp);
    const user = await this.UserService.findByEmail(email);
    const user_id = (user as any)._id?.toString();

    const parent = await this.parentService.validateParent(user_id);
    if (!parent)
      throw new UnauthorizedException('Email này không được đăng ký làm tài khoản phụ huynh');
    const tokens = await this.generateTokens(user_id, email, 'parent');
    return { token: tokens.accessToken };
  }

  async loginStaffWithOtp(email: string, otp: string): Promise<{ token: string }> {
    await this.otpService.verifyOTP(email, otp);
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const user_id = (user as any)['_id'].toString();

    // Xác thực là staff
    const staff = await this.staffService.findByuser(user_id);
    if (!staff) {
      throw new UnauthorizedException('Không phải tài khoản nhân viên');
    }
    const tokens = await this.generateTokens(user_id, email, 'staff');
    return { token: tokens.accessToken };
  }
  // Admin login with OTP
  async loginAdminWithOtp(email: string, otp: string): Promise<{ token: string }> {
    // Xác thực OTP
    await this.otpService.verifyOTP(email, otp);

    // Lấy thông tin user
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const user_id = (user as any)['_id'].toString();

    // Xác thực là admin
    const admin = await this.adminService.findByuser(user_id);
    if (!admin) {
      throw new UnauthorizedException('Không phải tài khoản admin');
    }

    const tokens = await this.generateTokens(user_id, email, 'admin');

    return { token: tokens.accessToken };
  }

  async refreshTokens(
    user_id: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userModel.findOne({
      _id: user_id,
      refresh_token: refreshToken,
    });
    if (!user) throw new UnauthorizedException('Refresh token không hợp lệ');

    // Generate new tokens
    return this.generateTokens(user_id, user.email);
  }

  async generateTokens(
    user: string,
    email: string,
    role?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Determine user role if not provided
    if (!role) {
      // Try to determine if the user is an admin
      const admin = await this.adminService.findByuser(user);
      if (admin) {
        role = 'admin';
      } else {
        // Try to determine if the user is a staff
        const staff = await this.staffService.findByuser(user);
        if (staff) {
          role = 'staff';
        } else {
          // Try to determine if the user is a parent
          const parent = await this.parentService.findByUserId(user);
          if (parent) {
            role = 'parent';
          } else {
            role = 'user'; // Default role
          }
        }
      }
    }

    // Use the TokenGenerator to generate tokens
    const tokens = this.tokenService.generateTokens(user, email, role);

    // Store refresh token
    await this.updateRefreshToken(user, tokens.refreshToken);

    return tokens;
  }

  /**
   * Update user's refresh token in database
   * @param user User's ID
   * @param refreshToken New refresh token
   */
  async updateRefreshToken(user: string, refreshToken: string): Promise<void> {
    await this.userModel.updateOne({ _id: user }, { refresh_token: refreshToken }).exec();
  }

  // Phương thức xác thực tài khoản phụ huynh
  async validateParentAccount(userId: string): Promise<boolean> {
    const parent = await this.parentService.findByUserId(userId);
    if (!parent) {
      throw new UnauthorizedException('Không phải tài khoản phụ huynh');
    }
    return true;
  }

  // Phương thức xác thực tài khoản nhân viên
  async validateStaffAccount(userId: string): Promise<boolean> {
    const staff = await this.staffService.findByuser(userId);
    if (!staff) {
      throw new UnauthorizedException('Không phải tài khoản nhân viên');
    }
    return true;
  }
  // Lấy thông tin người dùng từ token
  async getMe(req: any): Promise<any> {
    let token: string | undefined;
    let userId: string | undefined;

    // Xử lý nhận token từ frontend
    if (typeof req === 'string') {
      // Nếu token được gửi trực tiếp
      token = req;
    } else if (req.headers && req.headers.authorization) {
      // Nếu token trong authorization header
      const authHeader = req.headers.authorization;
      token = authHeader && authHeader.split(' ')[1];
    } else if (req.body && req.body.token) {
      // Nếu token trong request body
      token = req.body.token;
    } else if (req.user && req.user.user) {
      // Nếu đã được giải mã bởi JwtAuthGuard
      userId = req.user.user;
    } else {
      throw new UnauthorizedException('Token không hợp lệ hoặc không được cung cấp');
    }

    // Nếu có token, giải mã nó để lấy userId
    if (token && !userId) {
      try {
        const decoded = this.tokenService.verifyToken(token);
        if (!decoded || !decoded.sub) {
          throw new UnauthorizedException('Token không hợp lệ');
        }
        userId = decoded.sub;
      } catch (error) {
        throw new UnauthorizedException('Token không hợp lệ');
      }
    }

    if (!userId) {
      throw new UnauthorizedException('Không thể xác định người dùng từ token');
    }

    // Lấy thông tin user
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Kiểm tra vai trò
    let role = 'user';
    let roleData: any = null;
    let profile: any = null;

    // Check if admin
    const admin = await this.adminService.findByuser(userId);
    if (admin) {
      role = 'admin';
      roleData = {
        _id: admin._id,
        // Thêm các trường khác của admin nếu cần
      };
    } else {
      // Check if staff
      const staff = await this.staffService.findByuser(userId);
      if (staff) {
        role = 'staff';
        roleData = {
          _id: staff._id,
          // Thêm các trường khác của staff nếu cần
        };
      } else {
        // Check if parent
        const parent = await this.parentService.findByUserId(userId);
        if (parent) {
          role = 'parent';
          roleData = {
            _id: parent._id,
            // Thêm các trường khác của parent nếu cần
          };
        }
      }
    } // Lấy thông tin profile
    const userProfile = await this.profileService.findByuser(userId);

    if (userProfile) {
      profile = {
        _id: userProfile._id,
        name: userProfile.name,
        phone: userProfile.phone,
        gender: userProfile.gender,
        birth: userProfile.birth,
        address: userProfile.address,
        avatar: userProfile.avatar,
        created_at: userProfile.created_at,
        updated_at: userProfile.updated_at,
      };
    } // Trả về thông tin người dùng
    return {
      user: {
        _id: user._id,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      role: role,
      profile: profile,
      [role]: roleData,
    };
  }

  // Phương thức xác thực tài khoản admin
  async validateAdminAccount(userId: string): Promise<boolean> {
    const admin = await this.adminService.findByuser(userId);
    if (!admin) {
      throw new UnauthorizedException('Không phải tài khoản admin');
    }
    return true;
  }

  // Lấy thông tin đăng nhập của phụ huynh
  async getParentLoginInfo(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const parent = await this.parentService.findByUserId(userId);
    if (!parent) {
      throw new UnauthorizedException('Không phải tài khoản phụ huynh');
    }

    // Generate tokens
    const tokens = await this.generateTokens(userId, user.email, 'parent');

    // Get parent profile
    const parent_profile = await this.profileService.findByuser(userId);

    // Return data with token
    return {
      token: tokens.accessToken,
      user: {
        _id: user,
        email: user.email,
        role: 'parent',
      },
      parent: {
        _id: parent._id,
      },
      profile: parent_profile
        ? {
            _id: parent_profile._id,
            name: parent_profile.name,
            phone: parent_profile.phone,
            gender: parent_profile.gender,
            birth: parent_profile.birth,
            address: parent_profile.address,
            avatar: parent_profile.avatar,
            created_at: parent_profile.created_at,
            updated_at: parent_profile.updated_at,
          }
        : null,
    };
  }

  // Lấy thông tin đăng nhập của nhân viên
  async getStaffLoginInfo(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const staff = await this.staffService.findByuser(userId);
    if (!staff) {
      throw new UnauthorizedException('Không phải tài khoản nhân viên');
    } // Generate tokens
    const tokens = await this.generateTokens(userId, user.email, 'staff');

    // Get staff profile
    const staff_profile = await this.profileService.findByuser(userId);

    // Return data with tokens
    return {
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      user: {
        _id: user,
        email: user.email,
        role: 'staff',
      },
      staff: {
        _id: staff._id,
      },
      profile: staff_profile
        ? {
            _id: staff_profile._id,
            name: staff_profile.name,
            phone: staff_profile.phone,
            gender: staff_profile.gender,
            birth: staff_profile.birth,
            address: staff_profile.address,
            avatar: staff_profile.avatar,
          }
        : null,
    };
  }

  // Lấy thông tin đăng nhập của admin
  async getAdminLoginInfo(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const admin = await this.adminService.findByuser(userId);
    if (!admin) {
      throw new UnauthorizedException('Không phải tài khoản admin');
    } // Generate tokens
    const tokens = await this.generateTokens(userId, user.email, 'admin');

    // Get admin profile
    const admin_profile = await this.profileService.findByuser(userId);

    // Return data with tokens
    return {
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      user: {
        _id: user,
        email: user.email,
        role: 'admin',
      },
      admin: {
        _id: admin._id,
      },
      profile: admin_profile
        ? {
            _id: admin_profile._id,
            name: admin_profile.name,
            phone: admin_profile.phone,
            gender: admin_profile.gender,
            birth: admin_profile.birth,
            address: admin_profile.address,
            avatar: admin_profile.avatar,
          }
        : null,
    };
  }

  /**
   * Đăng nhập bằng Google cho phụ huynh
   * Kiểm tra xem email có tồn tại trong hệ thống không
   * Nếu có, kiểm tra xem người dùng có vai trò parent không
   * @param email Email của người dùng
   * @returns Thông tin đăng nhập
   */
  async loginGoogle(token: string): Promise<any> {
  // 1. Xác thực token với Google
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: '485501319962-sh11atcehvgcfdfeoem7fv6igdqql6ud.apps.googleusercontent.com',
  });
  const payload = ticket.getPayload();
  const email = payload?.email;

  if (!email)
    throw new NotFoundException('Email không xác định từ Google token');

  // 2. Kiểm tra email trong hệ thống
  const user = await this.UserService.findByEmail(email);

  console.log("login user info",user);
  if (!user)
    throw new NotFoundException('Email không tồn tại trong hệ thống');

  const user_id = (user as any)._id?.toString();

  // 3. Xác định role
  let role = 'user';
 let profile: ProfileDocument | null = null;


  const admin = await this.adminService.findByuser(user_id);
  if (admin) {
    role = 'admin';
    profile = await this.profileService.findByuser(user_id);
  } else {
    const staff = await this.staffService.findByuser(user_id);
    if (staff) {
      role = 'staff';
      profile = await this.profileService.findByuser(user_id);
    } else {
      const parent = await this.parentService.findByUserId(user_id);
      if (parent) {
        role = 'parent';
        profile = await this.profileService.findByuser(user_id);
      }
    }
  }

  // 4. Generate tokens
  const tokens = await this.generateTokens(user_id, email, role);

  // 5. Return data with tokens
  return {
    tokens: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    },
    user: {
      email: user.email,
      role,
    },
    profile: profile
      ? {
          name: profile.name,
          phone: profile.phone,
          gender: profile.gender,
          birth: profile.birth,
          address: profile.address,
          avatar: profile.avatar,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        }
      : null,
  };
}
// ...existing code...
}
