import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { CampaignType } from '@/enums/campaign.enum';

export class UpdateCampaignClassDto {
  @ApiProperty({
    description: 'Campaign ID',
    example: '60d0fe4f5311236168a109ca',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  campaign?: string;

  @ApiProperty({
    description: 'Campaign Type',
    enum: CampaignType,
    example: CampaignType.PERIODIC,
    required: false,
  })
  @IsOptional()
  @IsEnum(CampaignType)
  campaign_type?: CampaignType;

  @ApiProperty({
    description: 'Class ID',
    example: '60d0fe4f5311236168a109cb',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  class?: string;
}
