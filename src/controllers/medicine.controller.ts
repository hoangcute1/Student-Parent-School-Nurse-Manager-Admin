import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { MedicineService } from '@/services/medicine.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CreateMedicineDto } from '@/decorations/dto/create-medicine.dto';
import { UpdateMedicineDto } from '@/decorations/dto/update-medicine.dto';

@ApiTags('medicines')
@Controller('medicines')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Get()
  @ApiOperation({ summary: 'Get all medicines' })
  @ApiResponse({ status: 200, description: 'Return all medicines.' })
  async findAll() {
    return this.medicineService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a medicine by ID' })
  @ApiParam({ name: 'id', description: 'Medicine ID' })
  @ApiResponse({ status: 200, description: 'Return the medicine.' })
  @ApiResponse({ status: 404, description: 'Medicine not found.' })
  async findOne(@Param('id') id: string) {
    return this.medicineService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new medicine' })
  @ApiResponse({ status: 201, description: 'The medicine has been created.' })
  async create(@Body() createMedicineDto: CreateMedicineDto) {
    return this.medicineService.create(createMedicineDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a medicine' })
  @ApiParam({ name: 'id', description: 'Medicine ID' })
  @ApiResponse({ status: 200, description: 'The medicine has been updated.' })
  @ApiResponse({ status: 404, description: 'Medicine not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateMedicineDto: UpdateMedicineDto,
  ) {
    return this.medicineService.update(id, updateMedicineDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a medicine' })
  @ApiParam({ name: 'id', description: 'Medicine ID' })
  @ApiResponse({ status: 200, description: 'The medicine has been deleted.' })
  @ApiResponse({ status: 404, description: 'Medicine not found.' })
  async remove(@Param('id') id: string) {
    return this.medicineService.remove(id);
  }
}
