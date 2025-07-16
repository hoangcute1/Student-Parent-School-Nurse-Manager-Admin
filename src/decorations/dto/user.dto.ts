import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'nva@example.com', description: 'Email người dùng' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu người dùng' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @IsString()
  password: string;
}
