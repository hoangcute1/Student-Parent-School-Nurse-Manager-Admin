import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserParentDto {
  @ApiProperty({
    example: 'parent@example.com',
    description: 'Email của phụ huynh',
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsString()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Mật khẩu của phụ huynh',
  })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @IsString()
  password: string;
}
