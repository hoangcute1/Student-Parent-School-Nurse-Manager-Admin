import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { MedicineType, MedicineUnit } from '@/schemas/medicine.schema';

