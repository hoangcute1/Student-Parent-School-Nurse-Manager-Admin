import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
  IsEnum,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStudentDto {
  @ApiProperty({ example: 'Nguyen Van A', description: 'Họ tên học sinh' })
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @IsString({ message: 'Họ tên phải là chuỗi' })
  name: string;

  @ApiProperty({ example: 'SV001', description: 'Mã học sinh' })
  @IsNotEmpty({ message: 'Mã học sinh không được để trống' })
  @IsString({ message: 'Mã học sinh phải là chuỗi' })
  studentId: string;

  @ApiProperty({ example: '2000-01-01', description: 'Ngày sinh' })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Ngày sinh không hợp lệ' })
  birth?: Date;

  @ApiProperty({
    example: 'male',
    description: 'Giới tính',
    enum: ['male', 'female', 'other'],
  })
  @IsOptional()
  @IsEnum(['male', 'female', 'other'], {
    message: 'Giới tính phải là male, female hoặc other',
  })
  gender?: string;

  @ApiProperty({ example: '10', description: 'Khối lớp' })
  @IsOptional()
  @IsString({ message: 'Khối lớp phải là chuỗi' })
  grade?: string;

  @ApiProperty({
    example: '60d0fe4f5311236168a109cb',
    description: 'ID của lớp (MongoDB ObjectID)',
    required: false,
  })
  @IsOptional()
  @IsMongoId({ message: 'ID lớp không hợp lệ' })
  classId?: string;

  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description: 'ID của phụ huynh (MongoDB ObjectID)',
    required: false,
  })
  @IsOptional()
  @IsMongoId({ message: 'ID phụ huynh không hợp lệ' })
  parentId?: string;
}
