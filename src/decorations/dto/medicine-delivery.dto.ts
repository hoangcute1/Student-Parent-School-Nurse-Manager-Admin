import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
  IsDateString,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MedicineDeliveryStatus } from '@/schemas/medicine-delivery.schema';

export class CreateMedicineDeliveryDto {
  @ApiProperty({
    example: 'Paracetamol',
    description: 'Tên thuốc',
  })
  @IsString()
  medicine_name: string;

  @ApiProperty({
    example: '2024-12-31T00:00:00.000Z',
    description: 'Ngày giao thuốc',
  })
  @IsDateString()
  delivery_date: Date;

  @ApiProperty({
    example: 30,
    description: 'Tổng số lượng thuốc',
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  total: number;

  @ApiProperty({
    example: MedicineDeliveryStatus.PENDING,
    enum: MedicineDeliveryStatus,
    description: 'Trạng thái giao thuốc',
  })
  @IsEnum(MedicineDeliveryStatus)
  status: MedicineDeliveryStatus;

  @ApiProperty({
    example: '2 tablets',
    description: 'Liều lượng mỗi lần uống',
  })
  @IsString()
  perDose: string;

  @ApiProperty({
    example: '3 times a day',
    description: 'Số lần uống mỗi ngày',
  })
  @IsString()
  perDay: string;

  @ApiProperty({
    example: 'Take after meals',
    description: 'Ghi chú',
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({
    example: 'Fever and headache',
    description: 'Lý do dùng thuốc',
  })
  @IsString()
  reason: string;

  @ApiProperty({
    example: '2024-12-31T00:00:00.000Z',
    description: 'Thời gian bắt đầu',
  })
  @IsDateString()
  sentAt: Date;

  @ApiProperty({
    example: '2025-01-07T00:00:00.000Z',
    description: 'Thời gian kết thúc',
  })
  @IsDateString()
  endAt: Date;

  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description: 'ID của học sinh',
  })
  @IsMongoId()
  student: string;
}

export class UpdateMedicineDeliveryDto {
  @IsString()
  @IsOptional()
  medicine_name?: string;

  @IsDateString()
  @IsOptional()
  delivery_date?: Date;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  total?: number;

  @IsEnum(MedicineDeliveryStatus)
  @IsOptional()
  status?: MedicineDeliveryStatus;

  @IsString()
  @IsOptional()
  perDose?: string;

  @IsString()
  @IsOptional()
  perDay?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsDateString()
  @IsOptional()
  sentAt?: Date;

  @IsDateString()
  @IsOptional()
  endAt?: Date;

  @IsMongoId()
  @IsOptional()
  student?: string;
}
