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
import { TreatmentHistoryService } from '@/services/treatment-history.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CreateTreatmentHistoryDto } from '@/decorations/dto/create-treatment-history.dto';
import { UpdateTreatmentHistoryDto } from '@/decorations/dto/update-treatment-history.dto';

@ApiTags('treatment-histories')
@Controller('treatment-histories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TreatmentHistoryController {
  constructor(private readonly treatmentHistoryService: TreatmentHistoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all treatment histories' })
  @ApiResponse({ status: 200, description: 'Return all treatment histories.' })
  async findAll() {
    return this.treatmentHistoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a treatment history by ID' })
  @ApiParam({ name: 'id', description: 'Treatment history ID' })
  @ApiResponse({ status: 200, description: 'Return the treatment history.' })
  @ApiResponse({ status: 404, description: 'Treatment history not found.' })
  async findOne(@Param('id') id: string) {
    return this.treatmentHistoryService.findById(id);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get treatment histories by student ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Return treatment histories for a student.' })
  async findByStudentId(@Param('studentId') studentId: string) {
    return this.treatmentHistoryService.findByStudentId(studentId);
  }

  @Get('staff/:staffId')
  @ApiOperation({ summary: 'Get treatment histories by staff ID' })
  @ApiParam({ name: 'staffId', description: 'Staff ID' })
  @ApiResponse({ status: 200, description: 'Return treatment histories for a staff member.' })
  async findByStaffId(@Param('staffId') staffId: string) {
    return this.treatmentHistoryService.findByStaffId(staffId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new treatment history' })
  @ApiResponse({ status: 201, description: 'The treatment history has been created.' })
  async create(@Body() createTreatmentHistoryDto: CreateTreatmentHistoryDto) {
    return this.treatmentHistoryService.create(createTreatmentHistoryDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a treatment history' })
  @ApiParam({ name: 'id', description: 'Treatment history ID' })
  @ApiResponse({ status: 200, description: 'The treatment history has been updated.' })
  @ApiResponse({ status: 404, description: 'Treatment history not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateTreatmentHistoryDto: UpdateTreatmentHistoryDto,
  ) {
    return this.treatmentHistoryService.update(id, updateTreatmentHistoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a treatment history' })
  @ApiParam({ name: 'id', description: 'Treatment history ID' })
  @ApiResponse({ status: 200, description: 'The treatment history has been deleted.' })
  @ApiResponse({ status: 404, description: 'Treatment history not found.' })
  async remove(@Param('id') id: string) {
    return this.treatmentHistoryService.remove(id);
  }
}
