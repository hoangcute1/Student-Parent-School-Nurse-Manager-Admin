import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateHealthRecordDto {
  @ApiProperty({
    description: 'Allergies of the student',
    example: 'Peanuts, Seafood',
  })
  @IsNotEmpty()
  @IsString()
  allergies: string;

  @ApiProperty({
    description: 'Chronic conditions of the student',
    example: 'Asthma, Diabetes',
    required: false,
  })
  @IsOptional()
  @IsString()
  chronic_conditions?: string;

  @ApiProperty({
    description: 'Treatment history of the student',
    example: 'Hospitalized for asthma in 2023',
    required: false,
  })
  @IsOptional()
  @IsString()
  treatment_history?: string;

  @ApiProperty({
    description: 'Vision information of the student',
    example: '20/20, wears glasses',
    required: false,
  })
  @IsOptional()
  @IsString()
  vision?: string;

  @ApiProperty({
    description: 'Additional notes about student health',
    example: 'Regular check-ups required',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'ID of the student this health record belongs to',
    example: '60d0fe4f5311236168a109ca',
  })
  @IsNotEmpty()
  @IsString()
  student_id: string;
}
