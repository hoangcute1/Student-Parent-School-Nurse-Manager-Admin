import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { MedicineUnit, MedicineType } from '../../schemas/medicine.schema';

export class CreateMedicineDto {
  @ApiProperty({ description: 'Tên thuốc' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Liều lượng' })
  @IsString()
  @IsNotEmpty()
  dosage: string;

  @ApiProperty({ description: 'Số lượng' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ enum: MedicineUnit, description: 'Đơn vị thuốc' })
  @IsEnum(MedicineUnit)
  unit: MedicineUnit;

  @ApiProperty({ enum: MedicineType, description: 'Loại thuốc' })
  @IsEnum(MedicineType)
  type: MedicineType;

  @ApiProperty({ description: 'Hướng dẫn sử dụng', required: false })
  @IsOptional()
  @IsString()
  usage_instructions?: string;

  @ApiProperty({ description: 'Tác dụng phụ', required: false })
  @IsOptional()
  @IsString()
  side_effects?: string;

  @ApiProperty({ description: 'Chống chỉ định', required: false })
  @IsOptional()
  @IsString()
  contraindications?: string;

  @ApiProperty({ description: 'Mô tả' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Ảnh', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ description: 'Thuốc kê đơn', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  is_prescription_required?: boolean;

  @ApiProperty({ description: 'Nhà sản xuất', required: false })
  @IsOptional()
  @IsString()
  manufacturer?: string;
}
