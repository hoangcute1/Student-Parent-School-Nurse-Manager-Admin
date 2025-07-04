import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsMongoId, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { FeedbackNotificationType, UserRole } from '@/schemas/feedback-notification.schema';

export class CreateFeedbackNotificationDto {
  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description: 'ID của feedback',
  })
  @IsMongoId()
  feedback: string;

  @ApiProperty({
    example: '60d0fe4f5311236168a109cb',
    description: 'ID của người nhận',
  })
  @IsMongoId()
  recipient: string;

  @ApiProperty({
    example: 'staff',
    description: 'Role của người nhận',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  recipientRole: string;

  @ApiProperty({
    example: 'new_feedback',
    description: 'Loại thông báo',
    enum: FeedbackNotificationType,
  })
  @IsEnum(FeedbackNotificationType)
  type: string;

  @ApiProperty({
    example: 'Feedback mới từ phụ huynh',
    description: 'Tiêu đề thông báo',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Phụ huynh Nguyễn Văn A đã gửi feedback về dịch vụ y tế',
    description: 'Nội dung thông báo',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class UpdateFeedbackNotificationDto {
  @ApiProperty({
    example: true,
    description: 'Đánh dấu đã đọc',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
