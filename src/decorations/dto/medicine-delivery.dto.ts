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
    example: '2024-12-31T00:00:00.000Z',
    description: 'Ngày giao thuốc',
  })
  @IsDateString()
  date: Date;

  @ApiProperty({
    example: 30,
    description: 'Tổng số lượng thuốc',
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
    example: '2 tablets',
    description: 'Liều lượng mỗi lần uống',
  })
  @IsString()
  @IsNotEmpty()
  per_dose: string;

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
    example: '2025-01-07T00:00:00.000Z',
    description: 'Thời gian kết thúc',
  })
  @IsDateString()
  end_at: Date;

  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description: 'ID của học sinh',
  })
  @IsMongoId()
  student: string;

  @ApiProperty({
    example: '60d0fe4f5311236168a109cb',
    description: 'ID của thuốc',
    required: true,
  })
  @IsMongoId()
  medicine: string;

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
    example: '2024-12-31T00:00:00.000Z',
    description: 'Ngày giao thuốc',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  date?: Date;

  @ApiProperty({
    example: 30,
    description: 'Tổng số lượng thuốc',
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  total?: number;

  @ApiProperty({
    example: MedicineDeliveryStatus.APPROVED,
    enum: MedicineDeliveryStatus,
    description: 'Trạng thái giao thuốc',
    required: false,
  })
  @IsEnum(MedicineDeliveryStatus)
  @IsOptional()
  status?: MedicineDeliveryStatus;

  @ApiProperty({
    example: '2 tablets',
    description: 'Liều lượng mỗi lần uống',
    required: false,
  })
  @IsString()
  @IsOptional()
  per_dose?: string;

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

  @ApiProperty({
    example: '2025-01-07T00:00:00.000Z',
    description: 'Thời gian kết thúc',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  end_at?: Date;

  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description: 'ID của học sinh',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  student?: string;

  @ApiProperty({
    example: '60d0fe4f5311236168a109cb',
    description: 'ID của thuốc',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  medicine?: string;
}

export class ApproveRejectDeliveryDto {
  @ApiProperty({
    example: MedicineDeliveryStatus.APPROVED,
    enum: [MedicineDeliveryStatus.APPROVED, MedicineDeliveryStatus.REJECTED],
    description: 'Trạng thái phê duyệt',
  })
  @IsEnum([MedicineDeliveryStatus.APPROVED, MedicineDeliveryStatus.REJECTED])
  status: MedicineDeliveryStatus;

  @ApiProperty({
    example: 'Approved due to medical necessity',
    description: 'Lý do phê duyệt hoặc từ chối',
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;
}

export class DateRangeDto {
  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Ngày bắt đầu',
    required: true,
  })
  @IsDateString()
  from: string;

  @ApiProperty({
    example: '2024-12-31T23:59:59.999Z',
    description: 'Ngày kết thúc',
    required: true,
  })
  @IsDateString()
  to: string;
}
