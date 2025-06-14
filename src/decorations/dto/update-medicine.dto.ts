import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMedicineDto {
  @ApiProperty({
    description: 'Name of the medicine',
    example: 'Paracetamol',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Dosage of the medicine',
    example: '500mg',
    required: false,
  })
  @IsOptional()
  @IsString()
  dosage?: string;

  @ApiProperty({
    description: 'Description of the medicine',
    example: 'For fever and pain relief',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
