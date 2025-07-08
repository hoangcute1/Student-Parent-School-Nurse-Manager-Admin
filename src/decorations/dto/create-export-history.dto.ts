import { IsString, IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateExportHistoryDto {
  @IsString()
  @IsNotEmpty()
  medicineId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsNotEmpty()
  medicalStaffName: string;

  @IsDateString()
  @IsNotEmpty()
  exportDate: string;
}
