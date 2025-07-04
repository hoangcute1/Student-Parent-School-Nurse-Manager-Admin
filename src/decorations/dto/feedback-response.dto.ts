import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsMongoId, IsOptional } from 'class-validator';

export class CreateFeedbackResponseDto {
  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description: 'ID của feedback',
  })
  @IsMongoId()
  feedback: string;

  @ApiProperty({
    example: '60d0fe4f5311236168a109cb',
    description: 'ID của nhân viên trả lời',
  })
  @IsMongoId()
  responder: string;

  @ApiProperty({
    example: 'Cảm ơn phụ huynh đã phản hồi. Chúng tôi sẽ cải thiện dịch vụ.',
    description: 'Nội dung phản hồi',
  })
  @IsString()
  @IsNotEmpty()
  response: string;
}

export class UpdateFeedbackResponseDto {
  @ApiProperty({
    example: true,
    description: 'Đánh dấu đã đọc',
    required: false,
  })
  @IsOptional()
  isRead?: boolean;
}
