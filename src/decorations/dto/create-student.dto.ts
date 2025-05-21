import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'Nguyen Van A', description: 'Họ tên sinh viên' })
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @IsString({ message: 'Họ tên phải là chuỗi' })
  fullName: string;

  @ApiProperty({ example: 'SV001', description: 'Mã sinh viên' })
  @IsNotEmpty({ message: 'Mã sinh viên không được để trống' })
  @IsString({ message: 'Mã sinh viên phải là chuỗi' })
  studentId: string;

  @ApiProperty({ example: 'sva@example.com', description: 'Email sinh viên' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ example: '0912345678', description: 'Số điện thoại' })
  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  @Matches(/^[0-9]{10,11}$/, { message: 'Số điện thoại không hợp lệ' })
  phone?: string;

  @ApiProperty({ example: 'Hồ Chí Minh', description: 'Địa chỉ' })
  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  address?: string;
}
