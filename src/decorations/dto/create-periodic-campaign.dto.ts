import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDate, IsEnum, IsOptional } from 'class-validator';
import { CampaignStatus } from '@/enums/campaign.enum';
import { Type } from 'class-transformer';

export class CreatePeriodicCampaignDto {
  @ApiProperty({
    description: 'Staff ID who created the campaign',
    example: '60d0fe4f5311236168a109ca',
  })
  @IsNotEmpty()
  @IsString()
  staff: string;

  @ApiProperty({
    description: 'Name of the periodic campaign',
    example: 'Annual Health Check 2025',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Place where the campaign will be held',
    example: 'School Auditorium',
  })
  @IsNotEmpty()
  @IsString()
  place: string;

  @ApiProperty({
    description: 'Start date of the campaign',
    example: '2025-07-15T09:00:00.000Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: 'End date of the campaign',
    example: '2025-07-20T17:00:00.000Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({
    description: 'Status of the campaign',
    example: 'PENDING',
    enum: CampaignStatus,
    default: CampaignStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: string;

  @ApiProperty({
    description: 'Additional notes about the campaign',
    example: 'All students must bring their health records',
  })
  @IsNotEmpty()
  @IsString()
  notes: string;
}
