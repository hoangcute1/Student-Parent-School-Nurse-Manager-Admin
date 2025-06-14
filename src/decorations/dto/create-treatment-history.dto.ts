import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTreatmentHistoryDto {
  @ApiProperty({
    description: 'Student ID',
    example: '60d0fe4f5311236168a109ca',
  })
  @IsNotEmpty()
  @IsString()
  student: string;

  @ApiProperty({
    description: 'Staff ID',
    example: '60d0fe4f5311236168a109cb',
  })
  @IsNotEmpty()
  @IsString()
  staff: string;

  @ApiProperty({
    description: 'Health record ID',
    example: '60d0fe4f5311236168a109cc',
  })
  @IsNotEmpty()
  @IsString()
  record: string;

  @ApiProperty({
    description: 'Date of treatment',
    example: '2025-06-15T10:00:00.000Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({
    description: 'Description of treatment',
    example: 'Prescribed medication for fever',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Follow up in 3 days',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
