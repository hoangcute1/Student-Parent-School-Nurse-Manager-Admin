import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsDate } from 'class-validator';
import { NotificationType, NotificationStatus } from '@/schemas/notification.schema';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Campaign ID',
    example: '60d0fe4f5311236168a109ca',
  })
  @IsNotEmpty()
  @IsString()
  noti_campaign: string;

  @ApiProperty({
    description: 'Campaign type',
    example: 'VaccineNotification',
    enum: NotificationType,
  })
  @IsNotEmpty()
  @IsEnum(NotificationType)
  campaign_type: string;

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
    example: 'Vaccine campaign notification',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Please respond as soon as possible',
  })
  @IsNotEmpty()
  @IsString()
  notes: string;

  @ApiProperty({
    description: 'Confirmation status',
    example: 'Agree',
    enum: NotificationStatus,
  })
  @IsNotEmpty()
  @IsEnum(NotificationStatus)
  confirmation_status: string;
}
