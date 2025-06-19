import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class CreateUserStaffDto {
  @ApiProperty({
    example: 'staff@example.com',
    description: 'Email của nhân viên',
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsString()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Mật khẩu của nhân viên',
  })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @IsString()
  password: string;

  @ApiProperty({
    example: 'Giáo viên',
    description: 'Chức vụ',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly position?: string;
}
