import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsMongoId } from 'class-validator';

export class UpdateStaffDto {
  @ApiProperty({
    example: 'Giáo viên',
    description: 'Chức vụ',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly position?: string;

  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description: 'ID của User trong hệ thống (MongoDB ObjectID)',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  readonly user?: string;
}
