import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { HealthRecordService } from '@/services/health-record.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CreateHealthRecordDto } from '@/decorations/dto/create-health-record.dto';
import { UpdateHealthRecordDto } from '@/decorations/dto/update-health-record.dto';
import { Roles } from '@/decorations/roles.decorator';
import { RolesGuard } from '@/guards/roles.guard';
import { Role } from '@/enums/role.enum';

@ApiTags('health-records')
@Controller('health-records')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class HealthRecordController {
  constructor(private readonly healthRecordService: HealthRecordService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.STAFF, Role.DOCTOR, Role.NURSE)
  @ApiOperation({ 
    summary: 'Get all health records',
    description: 'Retrieves a list of all health records. Can be filtered by query parameters.'
  })
  @ApiQuery({ name: 'student_id', required: false, description: 'Filter by student ID' })
  @ApiQuery({ name: 'blood_type', required: false, description: 'Filter by blood type' })
  @ApiQuery({ name: 'allergies', required: false, description: 'Filter by allergies (partial match)' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of health records retrieved successfully.'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Insufficient permissions.',
  })
  async findAll(
    @Query('student_id') student_id?: string,
    @Query('blood_type') blood_type?: string,
    @Query('allergies') allergies?: string,
  ) {
    if (student_id || blood_type || allergies) {
      return this.healthRecordService.findWithFilters({ student_id, blood_type, allergies });
    }
    return this.healthRecordService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.STAFF, Role.DOCTOR, Role.NURSE, Role.PARENT, Role.STUDENT)
  @ApiOperation({ 
    summary: 'Get health record by ID',
    description: 'Retrieves a health record by its ID.'
  })
  @ApiParam({ name: 'id', description: 'Health record ID' })
  @ApiResponse({ status: 200, description: 'Health record retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Health record not found.' })
  async findOne(@Param('id') id: string) {
    return this.healthRecordService.findById(id);
  }

  @Get('student/:studentId')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.STAFF, Role.DOCTOR, Role.NURSE, Role.PARENT, Role.STUDENT)
  @ApiOperation({ 
    summary: 'Get health record by student ID',
    description: 'Retrieves the health record for a specific student by their ID.'
  })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Health record retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Health record not found for this student.' })
  async findByStudentId(@Param('studentId') studentId: string) {
    return this.healthRecordService.findByStudentId(studentId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.STAFF, Role.DOCTOR, Role.NURSE)
  @ApiOperation({ 
    summary: 'Create new health record',
    description: 'Creates a new health record for a student.'
  })
  @ApiBody({ type: CreateHealthRecordDto })
  @ApiResponse({ status: 201, description: 'Health record created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid input data or student already has a health record.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Insufficient permissions.',
  })
  async create(@Body() createHealthRecordDto: CreateHealthRecordDto) {
    try {
      return await this.healthRecordService.create(createHealthRecordDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        error.message || 'Failed to create health record',
      );
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.STAFF, Role.DOCTOR, Role.NURSE)
  @ApiOperation({ 
    summary: 'Update health record',
    description: 'Updates an existing health record by its ID.'
  })
  @ApiParam({ name: 'id', description: 'Health record ID' })
  @ApiBody({ type: UpdateHealthRecordDto })
  @ApiResponse({
    status: 200,
    description: 'Health record updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Health record not found.' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid input data.' })
  async update(
    @Param('id') id: string,
    @Body() updateHealthRecordDto: UpdateHealthRecordDto,
  ) {
    try {
      return await this.healthRecordService.update(id, updateHealthRecordDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        error.message || 'Failed to update health record',
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @ApiOperation({ 
    summary: 'Delete health record',
    description: 'Deletes a health record by its ID. Admin only.'
  })
  @ApiParam({ name: 'id', description: 'Health record ID' })
  @ApiResponse({ status: 200, description: 'Health record deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Health record not found.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Insufficient permissions.',
  })
  async remove(@Param('id') id: string) {
    return this.healthRecordService.remove(id);
  }
}
