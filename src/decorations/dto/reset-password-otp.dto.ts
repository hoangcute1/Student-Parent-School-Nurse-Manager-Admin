import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class ResetPasswordWithOtpDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email người dùng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsString({ message: 'Email phải là chuỗi' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Mã OTP' })
  @IsNotEmpty({ message: 'OTP không được để trống' })
  @IsString({ message: 'OTP phải là chuỗi' })
  @Length(6, 6, { message: 'OTP phải có 6 ký tự' })
  otp: string;

  @ApiProperty({ example: 'newPassword123', description: 'Mật khẩu mới' })
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  @IsString({ message: 'Mật khẩu mới phải là chuỗi' })
  newPassword: string;
}
