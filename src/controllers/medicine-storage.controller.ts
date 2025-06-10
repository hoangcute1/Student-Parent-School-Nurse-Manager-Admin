import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { MedicineStorageService } from '@/services/medicine-storage.service';
import {
  CreateMedicineStorageDto,
  UpdateMedicineStorageDto,
} from '@/decorations/dto/medicine-storage.dto';
import { MedicineStorage } from '@/schemas/medicine-storage.schema';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('medicine-storage')
@Controller('medicine-storage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MedicineStorageController {
  constructor(
    private readonly medicineStorageService: MedicineStorageService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all medicines in storage',
    description:
      'Retrieve all medicines stored in the system with optional filtering.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all medicines in storage.',
    type: MedicineStorage,
    isArray: true,
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. You do not have permission to access this resource.',
  })
  async getMedicines() {
    return this.medicineStorageService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new medicine in storage',
    description: 'Add a new medicine to the storage system.',
  })
  @ApiResponse({
    status: 201,
    description: 'The medicine has been successfully created.',
    type: MedicineStorage,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. The input data is invalid.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. You do not have permission to access this resource.',
  })
  async createMedicine(
    @Body() createMedicineDto: CreateMedicineStorageDto,
  ): Promise<MedicineStorage> {
    return this.medicineStorageService.create(createMedicineDto);
  }

  @Get('expiring')
  async getExpiringMedicines(
    @Query('days', ParseIntPipe) days?: number,
  ): Promise<MedicineStorage[]> {
    const daysToExpire = days || 30;
    return this.medicineStorageService.findExpiring(daysToExpire);
  }

  @Get(':id')
  async getMedicineById(@Param('id') id: string): Promise<MedicineStorage> {
    return this.medicineStorageService.findById(id);
  }

  @Patch(':id')
  async updateMedicine(
    @Param('id') id: string,
    @Body() updateMedicineDto: UpdateMedicineStorageDto,
  ): Promise<MedicineStorage> {
    return this.medicineStorageService.update(id, updateMedicineDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMedicine(@Param('id') id: string): Promise<void> {
    await this.medicineStorageService.remove(id);
  }

  @Post('batch')
  @HttpCode(HttpStatus.CREATED)
  async createManyMedicines(
    @Body() medicines: CreateMedicineStorageDto[],
  ): Promise<MedicineStorage[]> {
    return this.medicineStorageService.createMany(medicines);
  }

  @Delete('batch')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteManyMedicines(@Body('ids') ids: string[]): Promise<void> {
    await this.medicineStorageService.removeMany(ids);
  }
}
