import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateSimpleNotificationDto {
  @ApiProperty({
    description: 'Ngày hẹn tư vấn (ISO string hoặc Date)',
    example: '2025-07-15T09:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  @IsOptional()
  consultation_date?: string | Date;

  @ApiProperty({
    description: 'Giờ hẹn tư vấn',
    example: '09:00',
  })
  @IsOptional()
  @IsString()
  consultation_time?: string;

  @ApiProperty({
    description: 'Tên bác sĩ tư vấn',
    example: 'Bác sĩ Nguyễn Văn A',
  })
  @IsOptional()
  @IsString()
  consultation_doctor?: string;

  @ApiProperty({
    description: 'ID nhân viên y tế lập lịch hẹn tư vấn',
    example: '60d0fe4f5311236168a109ce',
    required: false,
  })
  @IsOptional()
  @IsString()
  consultation_staff_id?: string;
  @ApiProperty({
    description: 'Parent ID',
    example: '60d0fe4f5311236168a109cb',
  })
  @IsNotEmpty()
  @IsString()
  parent: string;

  @ApiProperty({
    description: 'Student ID',
    example: '60d0fe4f5311236168a109cc',
  })
  @IsNotEmpty()
  @IsString()
  student: string;

  @ApiProperty({
    description: 'Notification content',
    example: 'Sự kiện y tế mới đã được tạo',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Chi tiết về sự kiện y tế',
  })
  @IsNotEmpty()
  @IsString()
  notes: string;

  @ApiProperty({
    description: 'Notification type',
    example: 'MEDICAL_EVENT',
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Related entity ID (optional)',
    example: '60d0fe4f5311236168a109cd',
  })
  @IsOptional()
  @IsString()
  relatedId?: string;
}
