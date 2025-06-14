import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { NotificationType, NotificationStatus } from '@/schemas/notification.schema';

export class UpdateNotificationDto {
  @ApiProperty({
    description: 'Campaign ID',
    example: '60d0fe4f5311236168a109ca',
    required: false,
  })
  @IsOptional()
  @IsString()
  noti_campaign?: string;

  @ApiProperty({
    description: 'Campaign type',
    example: 'VaccineNotification',
    enum: NotificationType,
    required: false,
  })
  @IsOptional()
  @IsEnum(NotificationType)
  campaign_type?: string;

  @ApiProperty({
    description: 'Parent ID',
    example: '60d0fe4f5311236168a109cb',
    required: false,
  })
  @IsOptional()
  @IsString()
  parent?: string;

  @ApiProperty({
    description: 'Student ID',
    example: '60d0fe4f5311236168a109cc',
    required: false,
  })
  @IsOptional()
  @IsString()
  student?: string;

  @ApiProperty({
    description: 'Notification content',
    example: 'Vaccine campaign notification',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Please respond as soon as possible',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Confirmation status',
    example: 'Agree',
    enum: NotificationStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(NotificationStatus)
  confirmation_status?: string;
}
