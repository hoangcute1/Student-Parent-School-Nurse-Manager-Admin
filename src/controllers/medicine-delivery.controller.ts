import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MedicineDeliveryService } from '@/services/medicine-delivery.service';
import {
  CreateMedicineDeliveryDto,
  UpdateMedicineDeliveryDto,
} from '@/decorations/dto/medicine-delivery.dto';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';

@ApiTags('medicine-deliveries')
@Controller('medicine-deliveries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MedicineDeliveryController {
  constructor(private readonly medicineDeliveryService: MedicineDeliveryService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo lịch giao thuốc mới' })
  @ApiResponse({ status: 201, description: 'Lịch giao thuốc đã được tạo.' })
  create(@Body() createMedicineDeliveryDto: CreateMedicineDeliveryDto) {
    return this.medicineDeliveryService.create(createMedicineDeliveryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả lịch giao thuốc' })
  findAll() {
    return this.medicineDeliveryService.findAll();
  }

  @Get('student/:id')
  @ApiOperation({ summary: 'Lấy danh sách lịch giao thuốc của một học sinh' })
  findByStudent(@Param('id') id: string) {
    return this.medicineDeliveryService.findByStudent(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một lịch giao thuốc' })
  findOne(@Param('id') id: string) {
    return this.medicineDeliveryService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin lịch giao thuốc' })
  update(
    @Param('id') id: string,
    @Body() updateMedicineDeliveryDto: UpdateMedicineDeliveryDto,
  ) {
    return this.medicineDeliveryService.update(id, updateMedicineDeliveryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa lịch giao thuốc' })
  remove(@Param('id') id: string) {
    return this.medicineDeliveryService.remove(id);
  }
}
