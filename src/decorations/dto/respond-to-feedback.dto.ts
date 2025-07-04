import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class RespondToFeedbackDto {
  @ApiProperty({
    example: '60d0fe4f5311236168a109cb',
    description: 'ID của nhân viên phản hồi',
  })
  @IsMongoId()
  responderId: string;

  @ApiProperty({
    example: 'Cảm ơn phụ huynh đã góp ý. Chúng tôi sẽ cải thiện dịch vụ trong thời gian tới.',
    description: 'Nội dung phản hồi từ nhân viên',
  })
  @IsString()
  @IsNotEmpty()
  response: string;
}
