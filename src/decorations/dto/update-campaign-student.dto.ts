import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { StudentCampaignStatus } from '@/enums/campaign.enum';
import { Type } from 'class-transformer';

export class UpdateCampaignStudentDto {
  @ApiProperty({
    description: 'Class Campaign ID',
    example: '60d0fe4f5311236168a109ca',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  class_campaign?: string;

  @ApiProperty({
    description: 'Student ID',
    example: '60d0fe4f5311236168a109cb',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  student?: string;

  @ApiProperty({
    description: 'Campaign Status',
    enum: StudentCampaignStatus,
    example: StudentCampaignStatus.COMPLETED,
    required: false,
  })
  @IsOptional()
  @IsEnum(StudentCampaignStatus)
  status?: StudentCampaignStatus;

  @ApiProperty({
    description: 'Campaign Date',
    example: '2025-06-14T12:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @ApiProperty({
    description: 'After Campaign Status',
    example: 'false',
    required: false,
  })
  @IsOptional()
  @IsString()
  after_campaign?: string;
}
