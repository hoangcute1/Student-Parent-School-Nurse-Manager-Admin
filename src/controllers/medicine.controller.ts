import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MedicineService } from '../services/medicine.service';
import { Medicine } from '../schemas/medicine.schema';
import { CreateMedicineDto } from '../decorations/dto/create-medicine.dto';
import { ExportHistoryService } from '../services/export-history.service';

@Controller('medicines')
export class MedicineController {
  constructor(
    private readonly medicineService: MedicineService,
    private readonly exportHistoryService: ExportHistoryService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMedicineDto: CreateMedicineDto) {
    const medicine = await this.medicineService.create(createMedicineDto);
    return {
      message: 'Tạo thuốc thành công',
      data: medicine,
    };
  }

  @Get()
  async findAll() {
    return this.medicineService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.medicineService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Medicine>) {
    return this.medicineService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.medicineService.remove(id);
    return;
  }

  @Post(':id/export')
  @HttpCode(HttpStatus.OK)
  async exportMedicine(
    @Param('id') id: string,
    @Body()
    exportData: {
      quantity: number;
      reason: string;
      medicalStaffName: string;
      exportDate: string;
    },
  ) {
    try {
      // Get current medicine
      const medicine = await this.medicineService.findOne(id);
      if (!medicine) {
        return {
          success: false,
          message: 'Medicine not found',
        };
      }

      // Check if there's enough quantity
      if (medicine.quantity < exportData.quantity) {
        return {
          success: false,
          message: `Insufficient quantity. Available: ${medicine.quantity}, Requested: ${exportData.quantity}`,
        };
      }

      // Update medicine quantity
      const newQuantity = medicine.quantity - exportData.quantity;
      await this.medicineService.update(id, { quantity: newQuantity });

      // Create export history
      await this.exportHistoryService.create({
        medicineId: id,
        quantity: exportData.quantity,
        reason: exportData.reason,
        medicalStaffName: exportData.medicalStaffName,
        exportDate: exportData.exportDate,
      });

      return {
        success: true,
        message: `Successfully exported ${exportData.quantity} units. New quantity: ${newQuantity}`,
        data: {
          medicationId: id,
          exportedQuantity: exportData.quantity,
          newQuantity: newQuantity,
          exportDate: exportData.exportDate,
          reason: exportData.reason,
          medicalStaffName: exportData.medicalStaffName,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Error exporting medicine: ${error.message}`,
      };
    }
  }
}
