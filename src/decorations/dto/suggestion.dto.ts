import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  Max,
  IsMongoId,
  IsOptional,
} from 'class-validator';

export class CreateSuggestionDto {
  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description: 'ID của phụ huynh',
  })
  @IsNotEmpty()
  @IsMongoId()
  readonly parent: string;

  @ApiProperty({
    example: 'Cải thiện chất lượng bữa trưa',
    description: 'Tiêu đề góp ý',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    example: 'Nhà trường nên bổ sung thêm nhiều loại thực phẩm dinh dưỡng...',
    description: 'Nội dung góp ý chi tiết',
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({
    example: 4,
    description: 'Đánh giá (1-5 sao)',
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  readonly rating: number;
}

export class UpdateSuggestionDto {
  @ApiProperty({
    example: 'Cải thiện chất lượng bữa trưa',
    description: 'Tiêu đề góp ý',
  })
  @IsString()
  @IsOptional()
  readonly title?: string;

  @ApiProperty({
    example: 'Nhà trường nên bổ sung thêm nhiều loại thực phẩm dinh dưỡng...',
    description: 'Nội dung góp ý chi tiết',
  })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiProperty({
    example: 4,
    description: 'Đánh giá (1-5 sao)',
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  readonly rating?: number;
}
