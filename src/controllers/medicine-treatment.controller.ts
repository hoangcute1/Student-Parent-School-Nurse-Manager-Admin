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
import { MedicineTreatmentService } from '@/services/medicine-treatment.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CreateMedicineTreatmentDto, UpdateMedicineTreatmentDto } from '@/decorations/dto/medicine-treatment.dto';


@ApiTags('medicine-treatments')
@Controller('medicine-treatments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MedicineTreatmentController {
  constructor(
    private readonly medicineTreatmentService: MedicineTreatmentService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all medicine treatments' })
  @ApiResponse({ status: 200, description: 'Return all medicine treatments.' })
  async findAll() {
    return this.medicineTreatmentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a medicine treatment by ID' })
  @ApiParam({ name: 'id', description: 'Medicine treatment ID' })
  @ApiResponse({ status: 200, description: 'Return the medicine treatment.' })
  @ApiResponse({ status: 404, description: 'Medicine treatment not found.' })
  async findOne(@Param('id') id: string) {
    return this.medicineTreatmentService.findById(id);
  }

  @Get('treatment/:treatmentId')
  @ApiOperation({ summary: 'Get medicine treatments by treatment ID' })
  @ApiParam({ name: 'treatmentId', description: 'Treatment ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the medicine treatments for a treatment.',
  })
  async findByTreatmentId(@Param('treatmentId') treatmentId: string) {
    return this.medicineTreatmentService.findByTreatmentId(treatmentId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new medicine treatment' })
  @ApiResponse({
    status: 201,
    description: 'The medicine treatment has been created.',
  })
  async create(@Body() createMedicineTreatmentDto: CreateMedicineTreatmentDto) {
    return this.medicineTreatmentService.create(createMedicineTreatmentDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a medicine treatment' })
  @ApiParam({ name: 'id', description: 'Medicine treatment ID' })
  @ApiResponse({
    status: 200,
    description: 'The medicine treatment has been updated.',
  })
  @ApiResponse({ status: 404, description: 'Medicine treatment not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateMedicineTreatmentDto: UpdateMedicineTreatmentDto,
  ) {
    return this.medicineTreatmentService.update(id, updateMedicineTreatmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a medicine treatment' })
  @ApiParam({ name: 'id', description: 'Medicine treatment ID' })
  @ApiResponse({
    status: 200,
    description: 'The medicine treatment has been deleted.',
  })
  @ApiResponse({ status: 404, description: 'Medicine treatment not found.' })
  async remove(@Param('id') id: string) {
    return this.medicineTreatmentService.remove(id);
  }
}
