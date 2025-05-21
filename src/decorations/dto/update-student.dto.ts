import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateStudentDto {
  @ApiProperty({
    example: 'Nguyen Van A',
    description: 'Họ tên sinh viên',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Họ tên phải là chuỗi' })
  fullName?: string;

  @ApiProperty({
    example: 'SV001',
    description: 'Mã sinh viên',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Mã sinh viên phải là chuỗi' })
  studentId?: string;

  @ApiProperty({
    example: 'sva@example.com',
    description: 'Email sinh viên',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @ApiProperty({
    example: '0912345678',
    description: 'Số điện thoại',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  @Matches(/^[0-9]{10,11}$/, { message: 'Số điện thoại không hợp lệ' })
  phone?: string;

  @ApiProperty({
    example: 'Hồ Chí Minh',
    description: 'Địa chỉ',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  address?: string;
}
