import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MedicineDeliveryStatus } from '@/schemas/medicine-delivery.schema';

export class CreateMedicineDeliveryDto {
  @ApiProperty({
    example: 'Paracetamol Delivery',
    description: 'Tên lịch giao thuốc',
  })
  @IsString()
  @IsNotEmpty()
  name: string;


  @ApiProperty({
    example: 30,
    description: 'Tổng số liều',
  })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  total: number;

  @ApiProperty({
    example: MedicineDeliveryStatus.PENDING,
    enum: MedicineDeliveryStatus,
    description: 'Trạng thái giao thuốc',
  })
  @IsEnum(MedicineDeliveryStatus)
  @IsOptional()
  status?: MedicineDeliveryStatus;


  @ApiProperty({
    example: '3 times a day',
    description: 'Số lần uống mỗi ngày',
  })
  @IsString()
  @IsNotEmpty()
  per_day: string;

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
  @IsNotEmpty()
  reason: string;

  @ApiProperty({
    example: '2024-12-31T00:00:00.000Z',
    description: 'Thời gian bắt đầu (mặc định là thời gian hiện tại)',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  sent_at?: Date;


  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description: 'ID của học sinh',
  })
  @IsMongoId()
  student: string;

  @ApiProperty({
    example: '60d0fe4f5311236168a109cb',
    description: 'ID của phụ huynh',
  })
  @IsMongoId()
  parent: string;


  @ApiProperty({
    example: '60d0fe4f5311236168a109cc',
    description: 'ID của nhân viên y tế',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  staff?: string;
}

export class UpdateMedicineDeliveryDto {
  @ApiProperty({
    example: 'Updated Paracetamol Delivery',
    description: 'Tên lịch giao thuốc',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;


  @ApiProperty({
    example: 30,
    description: 'Tổng số liều',
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  total?: number;

  @ApiProperty({
    enum: MedicineDeliveryStatus,
    description: 'Trạng thái giao thuốc',
    required: false,
  })
  @IsEnum(MedicineDeliveryStatus)
  @IsOptional()
  status?: MedicineDeliveryStatus;


  @ApiProperty({
    example: '3 times a day',
    description: 'Số lần uống mỗi ngày',
    required: false,
  })
  @IsString()
  @IsOptional()
  per_day?: string;

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
    required: false,
  })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({
    example: '2024-12-31T00:00:00.000Z',
    description: 'Thời gian bắt đầu (mặc định là thời gian hiện tại)',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  sent_at?: Date;


}
