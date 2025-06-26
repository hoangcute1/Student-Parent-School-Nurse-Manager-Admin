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

@Controller('medicines')
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

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
}
