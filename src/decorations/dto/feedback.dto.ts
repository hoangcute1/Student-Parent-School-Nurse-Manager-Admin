import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsMongoId, IsOptional } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description: 'ID của phụ huynh',
  })
  @IsMongoId()
  parent: string;

  @ApiProperty({
    example: 'Phản hồi về dịch vụ y tế',
    description: 'Tiêu đề phản hồi',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Tôi muốn góp ý về việc cấp phát thuốc...',
    description: 'Nội dung phản hồi',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'illness',
    description: 'Loại thắc mắc: illness, nutrition, development, mental, prevention, other',
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;
}

export class UpdateFeedbackDto {
  @ApiProperty({
    example: 'Cảm ơn phản hồi của phụ huynh...',
    description: 'Phản hồi từ nhân viên',
  })
  @IsString()
  @IsNotEmpty()
  response: string;
}

export class FilterFeedbackDto {
  @ApiProperty({
    required: false,
    description: 'ID của phụ huynh',
  })
  @IsMongoId()
  @IsOptional()
  parent?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo trạng thái phản hồi',
    enum: ['answered', 'pending'],
  })
  @IsString()
  @IsOptional()
  status?: 'answered' | 'pending';
}
