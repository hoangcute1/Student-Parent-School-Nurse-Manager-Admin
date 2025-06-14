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

  async logout(userId: string, token: string): Promise<void> {
    // Đảm bảo chỉ xóa refresh_token nếu token khớp
    await this.userModel
      .updateOne({ _id: userId, refresh_token: token }, { refresh_token: null })
      .exec();
  }

  async loginParent(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const userId = (user as any)._id?.toString();
    const parent = await this.parentService.validateParent(userId);
    if (!parent)
      throw new UnauthorizedException(
        'Email này không được đăng ký làm tài khoản phụ huynh',
      );
    const parent_profile = await this.profileService.findByUserId(userId);
    const response = {
      _id: parent_profile?._id,
      phone: parent_profile?.phone,
      fullName: parent_profile?.name, // Changed from 'name' to 'fullName' to avoid deprecation
      gender: parent_profile?.gender,
      birth: parent_profile?.birth,
      address: parent_profile?.address,
      avatar: parent_profile?.avatar,
      created_at: parent_profile?.created_at,
      updated_at: parent_profile?.updated_at,
    };
    return response;
  }

  async loginStaff(email: string, password: string): Promise<Staff | null> {
    const user = await this.validateUser(email, password);
    const userId = (user as any)._id?.toString();
    const staff = await this.staffService.findByUserId(userId);
    console.log(staff);
    if (!staff)
      throw new UnauthorizedException('Không phải tài khoản nhân viên');
    return staff;
  }
  async loginAdmin(email: string, password: string): Promise<Admin | null> {
    const user = await this.validateUser(email, password);
    const userId = (user as any)._id?.toString();
    const admin = await this.adminService.validateAdmin(userId);
    if (!admin) {
      throw new UnauthorizedException('Không phải tài khoản admin');
    }
    return admin;
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userModel.findOne({
      _id: userId,
      refresh_token: refreshToken,
    });
    if (!user) throw new UnauthorizedException('Refresh token không hợp lệ');
    // Sinh access token mới
    const payload = { sub: userId, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async sendOtp(email: string): Promise<void> {
    await this.otpService.createOTP(email);
  }

  async verifyOtp(email: string, otp: string): Promise<void> {
    await this.otpService.verifyOTP(email, otp);
  }
}
