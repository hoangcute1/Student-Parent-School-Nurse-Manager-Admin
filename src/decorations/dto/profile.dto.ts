import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProfileDto {
  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Họ tên',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    example: 'male',
    description: 'Giới tính',
    enum: ['male', 'female', 'other'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['male', 'female', 'other'], {
    message: 'Giới tính phải là male, female hoặc other',
  })
  readonly gender?: string;

  @ApiProperty({
    example: '2000-01-01',
    description: 'Ngày sinh',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Ngày sinh không hợp lệ' })
  readonly birth?: Date;
  @ApiProperty({
    example: 'Hà Nội',
    description: 'Địa chỉ',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly address?: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Đường dẫn ảnh đại diện',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly avatar?: string;

  @ApiProperty({
    example: '0123456789',
    description: 'Số điện thoại',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly phone?: string;

  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description: 'ID của User trong hệ thống (MongoDB ObjectID)',
  })
  @IsNotEmpty()
  @IsMongoId()
  readonly user: string;
}
