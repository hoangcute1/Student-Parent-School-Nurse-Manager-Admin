import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from '@/schemas/otp.schema';

@Injectable()
export class OtpService {
  constructor(@InjectModel(Otp.name) private otpModel: Model<OtpDocument>) {}

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async createOTP(email: string): Promise<string> {
    // Delete any existing unused OTP for this email
    await this.otpModel.deleteMany({ email, isUsed: false }).exec();

    const otp = this.generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // OTP expires in 5 minutes

    const otpRecord = new this.otpModel({
      email,
      otp,
      expiresAt,
    });

    await otpRecord.save();

    // In thực tế, bạn sẽ gửi OTP qua email ở đây
    console.log(`OTP for ${email}: ${otp}`);

    return otp;
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const otpRecord = await this.otpModel
      .findOne({
        email,
        otp,
        isUsed: false,
        expiresAt: { $gt: new Date() },
      })
      .exec();

    if (!otpRecord) {
      throw new BadRequestException('OTP không hợp lệ hoặc đã hết hạn');
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    return true;
  }
}
