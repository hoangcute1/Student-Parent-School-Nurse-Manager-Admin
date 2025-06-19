import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateVaccineDto {
  @ApiProperty({
    description: 'Name of the vaccine',
    example: 'COVID-19 Vaccine',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Dosage of the vaccine',
    example: '0.5ml',
    required: false,
  })
  @IsOptional()
  @IsString()
  dosage?: string;
}
