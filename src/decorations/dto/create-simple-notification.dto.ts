import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateSimpleNotificationDto {
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
