import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserAdminDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email người dùng',
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu người dùng' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @IsString()
  password: string;
}
export class CreateAdminDto {
  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description:
      'ID của User trong hệ thống (MongoDB ObjectID) - Sẽ được lưu vào trường user',
  })
  @IsNotEmpty()
  @IsMongoId()
  readonly user: string;
}
export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description: 'ID của User trong hệ thống (MongoDB ObjectID)',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  readonly user?: string;
}

