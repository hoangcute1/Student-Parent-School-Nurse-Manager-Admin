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
import { Parent } from '@/schemas/parent.schema';
import { Staff } from '@/schemas/staff.schema';
import { Admin } from '@/schemas/admin.schema';
import { JwtService } from '@nestjs/jwt';
import { ProfileService } from './profile.service';
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private otpService: OtpService,
    private parentService: ParentService,
    private staffService: StaffService,
    private adminService: AdminService,
    private profileService: ProfileService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string, type: string) {
    console.log('Đang đăng nhập với email:', email, 'và loại:', type);
    if (type === 'parent') {
      const parent = await this.loginParent(email, password);
      if (!parent)
        throw new UnauthorizedException('Không phải tài khoản phụ huynh');
      return parent;
    } else if (type === 'staff') {
      // Staff và admin đều login bằng type staff
      const staff = await this.loginStaff(email, password);
      if (staff) return staff;
      // Nếu không phải staff, thử đăng nhập admin
      const admin = await this.loginAdmin(email, password);
      if (admin) return admin;
      throw new UnauthorizedException(
        'Không phải tài khoản nhân viên hoặc admin',
      );
    } else {
      // fallback: chỉ cho phép parent hoặc staff
      throw new UnauthorizedException('Loại tài khoản không hợp lệ');
    }
  }

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
      .findByIdAndUpdate(
        id,
        { ...updateUserDto, updated_at: new Date() },
        { new: true },
      )
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

  async loginWithOtp(
    email: string,
    password: string,
    otp: string,
  ): Promise<Parent | Staff | Admin | User> {
    // Xác thực tài khoản như login thông thường
    const user = await this.validateUser(email, password);
    // Xác thực OTP
    const isOtpValid = await this.otpService.verifyOTP(email, otp);
    if (!isOtpValid) throw new UnauthorizedException('OTP không hợp lệ');
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
      throw new UnauthorizedException(
        'Email này không được đăng ký làm tài khoản phụ huynh',
      );

    // Generate tokens
    const tokens = await this.generateTokens(user_id, user.email);

    // Get parent profile
    const parent_profile = await this.profileService.findByuser(user_id);

    // Return data with tokens
    return {
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
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
  async loginStaff(email: string, password: string): Promise<any> {
    const user = await this.validateUser(email, password);
    const user_id = (user as any)._id?.toString();
    const staff = await this.staffService.findByuser(user_id);
    if (!staff)
      throw new UnauthorizedException('Không phải tài khoản nhân viên');

    // Generate tokens
    const tokens = await this.generateTokens(user_id, user.email);

    // Get staff profile
    const staff_profile = await this.profileService.findByuser(user_id);

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
  async loginAdmin(email: string, password: string): Promise<any> {
    const user = await this.validateUser(email, password);
    const user_id = (user as any)._id?.toString();
    const admin = await this.adminService.validateAdmin(user_id);
    if (!admin) {
      throw new UnauthorizedException('Không phải tài khoản admin');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user_id, user.email);

    // Get admin profile
    const admin_profile = await this.profileService.findByuser(user_id);

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

  // Parent login with OTP
  async loginParentWithOtp(
    email: string,
    password: string,
    otp: string,
  ): Promise<any> {
    // Xác thực tài khoản như login thông thường
    const user = await this.validateUser(email, password);
    const user_id = (user as any)._id?.toString();

    // Xác thực là parent
    const parent = await this.parentService.validateParent(user_id);
    if (!parent)
      throw new UnauthorizedException(
        'Email này không được đăng ký làm tài khoản phụ huynh',
      );

    // Xác thực OTP
    await this.otpService.verifyOTP(email, otp);

    // Generate tokens
    const tokens = await this.generateTokens(user_id, user.email);

    // Get parent profile
    const parent_profile = await this.profileService.findByuser(user_id);

    // Return data with tokens
    return {
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
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

  // Staff login with OTP
  async loginStaffWithOtp(
    email: string,
    password: string,
    otp: string,
  ): Promise<any> {
    // Xác thực tài khoản như login thông thường
    const user = await this.validateUser(email, password);
    const user_id = (user as any)._id?.toString();

    // Xác thực là staff
    const staff = await this.staffService.findByuser(user_id);
    if (!staff)
      throw new UnauthorizedException('Không phải tài khoản nhân viên');

    // Xác thực OTP
    await this.otpService.verifyOTP(email, otp);

    // Generate tokens
    const tokens = await this.generateTokens(user_id, user.email);

    // Get staff profile
    const staff_profile = await this.profileService.findByuser(user_id);

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

  // Admin login with OTP
  async loginAdminWithOtp(
    email: string,
    password: string,
    otp: string,
  ): Promise<any> {
    // Xác thực tài khoản như login thông thường
    const user = await this.validateUser(email, password);
    const user_id = (user as any)._id?.toString();

    // Xác thực là admin
    const admin = await this.adminService.findByuser(user_id);
    if (!admin) throw new UnauthorizedException('Không phải tài khoản admin');

    // Xác thực OTP
    await this.otpService.verifyOTP(email, otp);

    // Generate tokens
    const tokens = await this.generateTokens(user_id, user.email);

    // Get admin profile
    const admin_profile = await this.profileService.findByuser(user_id);

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

  async sendOtp(email: string): Promise<void> {
    await this.otpService.createOTP(email);
  }

  async verifyOtp(email: string, otp: string): Promise<void> {
    await this.otpService.verifyOTP(email, otp);
  }

  /**
   * Generate JWT tokens (access and refresh)
   * @param user User's ID
   * @param email User's email
   * @returns Object containing access and refresh tokens
   */
  async generateTokens(
    user: string,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user, email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    // Store refresh token
    await this.updateRefreshToken(user, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Update user's refresh token in database
   * @param user User's ID
   * @param refreshToken New refresh token
   */
  async updateRefreshToken(user: string, refreshToken: string): Promise<void> {
    await this.userModel
      .updateOne({ _id: user }, { refresh_token: refreshToken })
      .exec();
  }

  // Phương thức xác thực tài khoản phụ huynh
  async validateParentAccount(userId: string): Promise<boolean> {
    const parent = await this.parentService.findByuser(userId);
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

    const parent = await this.parentService.findByuser(userId);
    if (!parent) {
      throw new UnauthorizedException('Không phải tài khoản phụ huynh');
    }

    // Generate tokens
    const tokens = await this.generateTokens(userId, user.email);

    // Get parent profile
    const parent_profile = await this.profileService.findByuser(userId);

    // Return data with tokens
    return {
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
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
    }

    // Generate tokens
    const tokens = await this.generateTokens(userId, user.email);

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
    }

    // Generate tokens
    const tokens = await this.generateTokens(userId, user.email);

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
}
