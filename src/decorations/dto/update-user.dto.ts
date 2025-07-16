import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';
import { CreateUserDto } from './user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 'nva@example.com',
    description: 'Email người dùng',
    required: false,
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    example: 'password123',
    description: 'Mật khẩu người dùng',
    required: false,
  })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @IsOptional()
  @IsString()
  password?: string;
}
