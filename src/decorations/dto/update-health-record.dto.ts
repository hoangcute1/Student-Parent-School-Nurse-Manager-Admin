import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateHealthRecordDto  {
  @ApiProperty({
    description: 'Allergies of the student',
    example: 'Peanuts, Seafood',
    required: false
  })
  @IsOptional()
  @IsString()
  allergies?: string;

  @ApiProperty({
    description: 'Chronic conditions of the student',
    example: 'Asthma, Diabetes',
    required: false
  })
  @IsOptional()
  @IsString()
  chronic_conditions?: string;

  @ApiProperty({
    description: 'Height of the student',
    example: '170 cm',
    required: false
  })
  @IsOptional()
  @IsString()
  height?: string;

  @ApiProperty({
    description: 'Weight of the student',
    example: '65 kg',
    required: false
  })
  @IsOptional()
  @IsString()
  weight?: string;

  @ApiProperty({
    description: 'Vision information of the student',
    example: '20/20, wears glasses',
    required: false
  })
  @IsOptional()
  @IsString()
  vision?: string;

  @ApiProperty({
    description: 'Hearing ability of the student',
    example: 'Normal',
    required: false
  })
  @IsOptional()
  @IsString()
  hearing?: string;

  @ApiProperty({
    description: 'Blood type of the student',
    example: 'A+',
    required: false
  })
  @IsOptional()
  @IsString()
  blood_type?: string;

  @ApiProperty({
    description: 'Treatment history of the student',
    example: 'Hospitalized for asthma in 2023',
    required: false
  })
  @IsOptional()
  @IsString()
  treatment_history?: string;

  @ApiProperty({
    description: 'Additional notes about student health',
    example: 'Regular check-ups required',
    required: false
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
