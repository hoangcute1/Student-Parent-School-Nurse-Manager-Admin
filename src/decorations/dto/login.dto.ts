import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsIn } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'nva@example.com', description: 'Email người dùng' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @ApiProperty({ example: 'staff', description: 'Vai trò người dùng (parent/staff)' })
  @IsNotEmpty({ message: 'Vai trò không được để trống' })
  @IsIn(['staff', 'parent'], { message: 'Vai trò phải là staff hoặc parent' })
  role: 'staff' | 'parent';
}
