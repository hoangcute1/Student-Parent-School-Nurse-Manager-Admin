import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { CampaignType } from '@/enums/campaign.enum';

export class CreateCampaignClassDto {
  @ApiProperty({
    description: 'Campaign ID',
    example: '60d0fe4f5311236168a109ca',
  })
  @IsNotEmpty()
  @IsMongoId()
  campaign: string;

  @ApiProperty({
    description: 'Campaign Type',
    enum: CampaignType,
    example: CampaignType.PERIODIC,
  })
  @IsNotEmpty()
  @IsEnum(CampaignType)
  campaign_type: CampaignType;

  @ApiProperty({
    description: 'Class ID',
    example: '60d0fe4f5311236168a109cb',
  })
  @IsNotEmpty()
  @IsMongoId()
  class: string;
}

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
