import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@/schemas/user.schema';
import { OtpService } from './otp.service';
import { ProfileService } from './profile.service';
import { StaffService } from './staff.service';
import { AdminService } from './admin.service';

/**
 * Sửa đổi và cập nhật loginStaffWithOtp
 */
@Injectable()
export class StaffLoginHelper {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private otpService: OtpService,
    private profileService: ProfileService,
    private staffService: StaffService,
    private adminService: AdminService,
  ) {}

  /**
   * Cập nhật xử lý loginStaffWithOtp để cho phép cả staff và admin đăng nhập
   */
  async loginStaffWithOtp(email: string, otp: string): Promise<any> {
    // Xác thực OTP
    await this.otpService.verifyOTP(email, otp);

    // Lấy thông tin user
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const user_id = (user as any)['_id'].toString();

    // Kiểm tra xem người dùng có phải là staff hoặc admin không
    const staff = await this.staffService.findByuser(user_id);
    const admin = await this.adminService.findByuser(user_id);

    if (!staff && !admin) {
      throw new UnauthorizedException(
        'Không phải tài khoản nhân viên hoặc admin',
      );
    }

    // Xác định role
    const role = admin ? 'admin' : 'staff';

    // Get profile
    const profile = await this.profileService.findByuser(user_id);

    // Mô phỏng cấu trúc response
    return {
      access_token: 'dummy_token_for_test', // Sẽ được thay thế bởi token thực
      user: {
        _id: user_id,
        email: user.email,
        role: role,
      },
      profile: profile
        ? {
            _id: profile._id,
            name: profile.name,
            phone: profile.phone,
            gender: profile.gender,
            birth: profile.birth,
            address: profile.address,
            avatar: profile.avatar,
          }
        : null,
    };
  }
}
