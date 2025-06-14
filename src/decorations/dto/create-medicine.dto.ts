import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMedicineDto {
  @ApiProperty({
    description: 'Name of the medicine',
    example: 'Paracetamol',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Dosage of the medicine',
    example: '500mg',
  })
  @IsNotEmpty()
  @IsString()
  dosage: string;

  @ApiProperty({
    description: 'Description of the medicine',
    example: 'For fever and pain relief',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
