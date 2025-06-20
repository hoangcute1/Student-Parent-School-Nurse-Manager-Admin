import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { MedicineType, MedicineUnit } from '@/schemas/medicine.schema';

export class UpdateMedicineDto {
  @ApiProperty({
    description: 'Name of the medicine',
    example: 'Paracetamol',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
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
    description: 'Unit of the medicine',
    example: MedicineUnit.TABLET,
    enum: MedicineUnit,
    required: false,
  })
  @IsOptional()
  @IsEnum(MedicineUnit)
  unit?: MedicineUnit;

  @ApiProperty({
    description: 'Type of the medicine',
    example: MedicineType.ANALGESIC,
    enum: MedicineType,
    required: false,
  })
  @IsOptional()
  @IsEnum(MedicineType)
  type?: MedicineType;

  @ApiProperty({
    description: 'Usage instructions for the medicine',
    example: 'Take 1-2 tablets every 4-6 hours as needed',
    required: false,
  })
  @IsOptional()
  @IsString()
  usage_instructions?: string;

  @ApiProperty({
    description: 'Possible side effects of the medicine',
    example: 'May cause drowsiness, nausea, or stomach pain',
    required: false,
  })
  @IsOptional()
  @IsString()
  side_effects?: string;

  @ApiProperty({
    description: 'Contraindications for the medicine',
    example:
      'Not suitable for patients with liver disease or alcohol dependency',
    required: false,
  })
  @IsOptional()
  @IsString()
  contraindications?: string;

  @ApiProperty({
    description: 'Description of the medicine',
    example: 'For fever and pain relief',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'URL to an image of the medicine',
    example: 'https://example.com/images/paracetamol.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'Whether the medicine requires a prescription',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_prescription_required?: boolean;

  @ApiProperty({
    description: 'Manufacturer of the medicine',
    example: 'GlaxoSmithKline',
    required: false,
  })
  @IsOptional()
  @IsString()
  manufacturer?: string;
}
