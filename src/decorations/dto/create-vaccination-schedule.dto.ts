import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateVaccinationScheduleDto {
  @ApiProperty({ example: 'Lịch tiêm chủng khối 2' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Tiêm vaccine phòng bệnh cho học sinh khối 2' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2025-07-20' })
  @IsDateString()
  vaccination_date: string;

  @ApiProperty({ example: '09:00' })
  @IsString()
  @IsNotEmpty()
  vaccination_time: string;

  @ApiProperty({ required: false, example: 'Phòng y tế' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false, example: 'Bác sĩ A' })
  @IsOptional()
  @IsString()
  doctor_name?: string;

  @ApiProperty({ required: false, example: 'Covid-19' })
  @IsOptional()
  @IsString()
  vaccine_type?: string;

  @ApiProperty({
    type: [String],
    example: ['664f1b2c1234567890abcdef', '664f1b2c1234567890abcdf0'],
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  student_ids: string[];

  @ApiProperty({ required: false, example: 2 })
  @IsOptional()
  @IsNumber()
  grade_level?: number;
}
