import configuration from '@/configuration';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: configuration().GOOGLE_EMAIL, // Thay bằng email Gmail của bạn
      pass: configuration().GOOGLE_PASSWORD, // Thay bằng app password đã tạo ở Google
    },
  });

  async sendOtpMail(to: string, otp: string) {
    await this.transporter.sendMail({
      from: configuration().GOOGLE_EMAIL, // Thay bằng email Gmail của bạn
      to,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
      html: `<b>Your OTP code is: ${otp}</b>`,
    });
  }
}
