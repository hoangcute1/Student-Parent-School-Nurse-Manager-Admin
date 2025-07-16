import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsMongoId, IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator';

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
}
export class CreateStaffDto {
  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description: 'ID của User trong hệ thống (MongoDB ObjectID)',
  })
  @IsNotEmpty()
  @IsMongoId()
  readonly user: string;
}
export class UpdateStaffDto {
  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description: 'ID của User trong hệ thống (MongoDB ObjectID)',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  readonly user?: string;
}
