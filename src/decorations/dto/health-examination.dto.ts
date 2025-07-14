import { ExaminationStatus } from '@/schemas/health-examination.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate, IsEnum, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHealthExaminationDto {
  @ApiProperty({ example: 'Khám sức khỏe định kỳ' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Mô tả khám sức khỏe' })
  @IsString()
  description: string;

  @ApiProperty({ example: '2025-07-20' })
  @IsDate()
  @Type(() => Date)
  examination_date: Date;

  @ApiProperty({ example: '09:00' })
  @IsString()
  examination_time: string;

  @ApiProperty({ example: 'Phòng y tế', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: 'Bác sĩ Nguyễn Văn A', required: false })
  @IsOptional()
  @IsString()
  doctor_name?: string;

  @ApiProperty({ example: 'Khám tổng quát', required: false })
  @IsOptional()
  @IsString()
  examination_type?: string;

  @ApiProperty({ example: 'grade', enum: ['grade', 'individual'] })
  @IsEnum(['grade', 'individual'])
  target_type: 'grade' | 'individual';

  @ApiProperty({ example: [1, 2, 3], required: false })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  grade_levels?: number[];

  @ApiProperty({ example: '66d9e9a4f8b123456789abcd', required: false })
  @IsOptional()
  @IsString()
  student_id?: string;
}

export class UpdateExaminationStatusDto {
  @ApiProperty({ enum: ExaminationStatus })
  @IsEnum(ExaminationStatus)
  status: ExaminationStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  parent_response_notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  rejection_reason?: string;
}

export class ScheduleConsultationDto {
  @ApiProperty({ example: '2025-08-01' })
  @IsDate()
  @Type(() => Date)
  consultation_date: Date;

  @ApiProperty({ example: '14:00' })
  @IsString()
  consultation_time: string;

  @ApiProperty({ example: 'Ghi chú tư vấn', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: '66d9e9a4f8b123456789abcd' })
  @IsString()
  student_id: string;

  @ApiProperty({ example: 'staffId', required: false })
  @IsOptional()
  @IsString()
  created_by?: string;
}
