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
import { VaccineService } from '@/services/vaccine.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CreateVaccineDto } from '@/decorations/dto/vaccine.dto';
import { UpdateVaccineDto } from '@/decorations/dto/update-vaccine.dto';

@ApiTags('vaccines')
@Controller('vaccines')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class VaccineController {
  constructor(private readonly vaccineService: VaccineService) {}

  @Get()
  @ApiOperation({ summary: 'Get all vaccines' })
  @ApiResponse({ status: 200, description: 'Return all vaccines.' })
  async findAll() {
    return this.vaccineService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vaccine by ID' })
  @ApiParam({ name: 'id', description: 'Vaccine ID' })
  @ApiResponse({ status: 200, description: 'Return the vaccine.' })
  @ApiResponse({ status: 404, description: 'Vaccine not found.' })
  async findOne(@Param('id') id: string) {
    return this.vaccineService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new vaccine' })
  @ApiResponse({ status: 201, description: 'The vaccine has been created.' })
  async create(@Body() createVaccineDto: CreateVaccineDto) {
    return this.vaccineService.create(createVaccineDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a vaccine' })
  @ApiParam({ name: 'id', description: 'Vaccine ID' })
  @ApiResponse({ status: 200, description: 'The vaccine has been updated.' })
  @ApiResponse({ status: 404, description: 'Vaccine not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateVaccineDto: UpdateVaccineDto,
  ) {
    return this.vaccineService.update(id, updateVaccineDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vaccine' })
  @ApiParam({ name: 'id', description: 'Vaccine ID' })
  @ApiResponse({ status: 200, description: 'The vaccine has been deleted.' })
  @ApiResponse({ status: 404, description: 'Vaccine not found.' })
  async remove(@Param('id') id: string) {
    return this.vaccineService.remove(id);
  }
}
