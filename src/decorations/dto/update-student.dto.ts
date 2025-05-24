import { ApiProperty } from '@nestjs/swagger';
import { 
  IsOptional, 
  IsString, 
  IsDate, 
  IsEnum, 
  IsMongoId 
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateStudentDto {
  @ApiProperty({
    example: 'Nguyen Van A',
    description: 'Họ tên học sinh',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Họ tên phải là chuỗi' })
  name?: string;

  @ApiProperty({
    example: 'SV001',
    description: 'Mã học sinh',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Mã học sinh phải là chuỗi' })
  studentId?: string;

  @ApiProperty({ 
    example: '2000-01-01', 
    description: 'Ngày sinh',
    required: false 
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Ngày sinh không hợp lệ' })
  birth?: Date;

  @ApiProperty({ 
    example: 'male', 
    description: 'Giới tính', 
    enum: ['male', 'female', 'other'],
    required: false 
  })
  @IsOptional()
  @IsEnum(['male', 'female', 'other'], { message: 'Giới tính phải là male, female hoặc other' })
  gender?: string;

  @ApiProperty({ 
    example: '10', 
    description: 'Khối lớp',
    required: false 
  })
  @IsOptional()
  @IsString({ message: 'Khối lớp phải là chuỗi' })
  grade?: string;

  @ApiProperty({ 
    example: '10A1', 
    description: 'Lớp',
    required: false 
  })
  @IsOptional()
  @IsString({ message: 'Lớp phải là chuỗi' })
  class?: string;
  @ApiProperty({ 
    example: '60d0fe4f5311236168a109ca', 
    description: 'ID của phụ huynh (MongoDB ObjectID)',
    required: false 
  })
  @IsOptional()
  @IsMongoId({ message: 'ID phụ huynh không hợp lệ' })
  parentId?: string;
}
