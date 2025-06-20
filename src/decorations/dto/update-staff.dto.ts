import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsMongoId } from 'class-validator';

export class UpdateStaffDto {
  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description: 'ID của User trong hệ thống (MongoDB ObjectID)',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  readonly user?: string;
}
