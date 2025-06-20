import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { MedicineType, MedicineUnit } from '@/schemas/medicine.schema';

export class FilterMedicineDto {
  @ApiProperty({
    description: 'Filter medicines by name (case insensitive)',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Filter medicines by type',
    enum: MedicineType,
    required: false,
  })
  @IsOptional()
  @IsEnum(MedicineType)
  type?: MedicineType;

  @ApiProperty({
    description: 'Filter medicines by unit',
    enum: MedicineUnit,
    required: false,
  })
  @IsOptional()
  @IsEnum(MedicineUnit)
  unit?: MedicineUnit;

  @ApiProperty({
    description: 'Filter medicines by prescription requirement',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  prescription?: boolean;

  @ApiProperty({
    description: 'Filter medicines by manufacturer',
    required: false,
  })
  @IsOptional()
  @IsString()
  manufacturer?: string;
}

export class PaginationDto {
  @ApiProperty({
    description: 'Page number (1-based)',
    default: 1,
    required: false,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value) || 1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    default: 10,
    required: false,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value) || 10)
  limit?: number = 10;
}

export class FilterMedicineWithPaginationDto extends PaginationDto {
  @ApiProperty({
    description: 'Filter medicines by name (case insensitive)',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Filter medicines by type',
    enum: MedicineType,
    required: false,
  })
  @IsOptional()
  @IsEnum(MedicineType)
  type?: MedicineType;

  @ApiProperty({
    description: 'Filter medicines by unit',
    enum: MedicineUnit,
    required: false,
  })
  @IsOptional()
  @IsEnum(MedicineUnit)
  unit?: MedicineUnit;

  @ApiProperty({
    description: 'Filter medicines by prescription requirement',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  prescription?: boolean;

  @ApiProperty({
    description: 'Filter medicines by manufacturer',
    required: false,
  })
  @IsOptional()
  @IsString()
  manufacturer?: string;
}
