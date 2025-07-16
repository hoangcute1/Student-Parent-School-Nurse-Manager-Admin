import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VaccineDto {
  @ApiProperty({
    description: 'Name of the vaccine',
    example: 'COVID-19 Vaccine',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Dosage of the vaccine',
    example: '0.5ml',
  })
  @IsNotEmpty()
  @IsString()
  dosage: string;
}
