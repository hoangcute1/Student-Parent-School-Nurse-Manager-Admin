import {
  IsString,
  IsNumber,
  IsDate,
  IsEnum,
  IsOptional,
  Min,
  IsPositive,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  MedicineStatus,
  MedicineType,
  MedicineUnit,
} from '@/schemas/medicine-storage.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMedicineStorageDto {
  @ApiProperty({
    example: 'Paracetamol',
    description: 'Tên thuốc',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: MedicineType.ANALGESIC,
    description: 'Loại thuốc',
    enum: MedicineType,
  })
  @IsEnum(MedicineType)
  type: MedicineType;

  @ApiProperty({
    example: 100,
    description: 'Tổng số lượng thuốc trong kho',
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  total: number;

  @ApiProperty({
    example: 50,
    description: 'Số lượng thuốc còn lại trong kho',
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amountLeft: number;

  @ApiProperty({
    example: MedicineUnit.TABLET,
    description: 'Đơn vị của thuốc',
    default: MedicineUnit,
  })
  @IsString()
  unit: string;

  @ApiProperty({
    example: MedicineStatus.AVAILABLE,
    enum: MedicineStatus,
    description: 'Trạng thái kho thuốc',
    default: MedicineStatus.AVAILABLE,
  })
  @IsEnum(MedicineStatus)
  status: MedicineStatus;
  @ApiProperty({
    example: '2024-12-31T00:00:00.000Z',
    description: 'Ngày hết hạn của thuốc (ISO 8601)',
  })
  @IsDateString()
  expired: Date;

  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    description: 'Chi tiết về thuốc',
    default: 0,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'https://example.com/medicine-image.jpg',
    description: 'Link ảnh thuốc',
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;
}

export class UpdateMedicineStorageDto
  implements Partial<CreateMedicineStorageDto>
{
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(MedicineType)
  @IsOptional()
  type?: MedicineType;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  amountLeft?: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  total?: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsEnum(MedicineStatus)
  @IsOptional()
  status?: MedicineStatus;

  @Type(() => Date)
  @IsOptional()
  expired?: Date;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;
}

export class UpdateStockDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantity: number;

  @IsEnum(['add', 'remove'])
  action: 'add' | 'remove';
}
