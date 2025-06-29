import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';

export class VerifyResetOtpDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email người dùng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Mã OTP' })
  @IsNotEmpty({ message: 'OTP không được để trống' })
  @IsString({ message: 'OTP phải là chuỗi' })
  @Length(6, 6, { message: 'OTP phải có 6 ký tự' })
  otp: string;
}

export class ResetPasswordWithTokenDto {
  @ApiProperty({ example: 'resetToken', description: 'Reset token trả về sau khi xác thực OTP' })
  @IsNotEmpty({ message: 'Reset token không được để trống' })
  @IsString({ message: 'Reset token phải là chuỗi' })
  resetToken: string;

  @ApiProperty({ example: 'newPassword123', description: 'Mật khẩu mới' })
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  @IsString({ message: 'Mật khẩu mới phải là chuỗi' })
  newPassword: string;
}
