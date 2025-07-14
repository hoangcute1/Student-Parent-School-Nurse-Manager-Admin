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
  Req,
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
import { Request } from 'express';

@ApiTags('health-records')
@Controller('health-records')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class HealthRecordController {
  constructor(private readonly healthRecordService: HealthRecordService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.STAFF, Role.DOCTOR, Role.NURSE, Role.PARENT, Role.STUDENT)
  @ApiOperation({
    summary: 'Get all health records',
    description: 'Retrieves a list of all health records. Can be filtered by query parameters.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of health records retrieved successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Insufficient permissions.',
  })
  async findAll() {
    // Nếu là parent, chỉ trả về health records của các con

    return this.healthRecordService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.STAFF, Role.DOCTOR, Role.NURSE, Role.PARENT, Role.STUDENT)
  @ApiOperation({
    summary: 'Get health record by ID',
    description: 'Retrieves a health record by its ID.',
  })
  @ApiParam({ name: 'id', description: 'Health record ID' })
  @ApiResponse({ status: 200, description: 'Health record retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Health record not found.' })
  async findOne(@Param('id') id: string) {
    return this.healthRecordService.findById(id);
  }

  @Get('/student/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get health record by Student ID',
    description: 'Retrieves a health record by its ID.',
  })
  @ApiResponse({ status: 200, description: 'Health record retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Health record not found.' })
  async getHealthRecordbyStudentId(@Param('studentId') studentId: string) {
    return this.healthRecordService.getHealthRecordsByStudentId(studentId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new health record',
    description: 'Creates a new health record for a student.',
  })
  @ApiBody({ type: CreateHealthRecordDto })
  @ApiResponse({ status: 201, description: 'Health record created successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid input data or student already has a health record.',
  })
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
      throw new BadRequestException(error.message || 'Failed to create health record');
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update health record',
    description: 'Updates an existing health record by its ID.',
  })
  @ApiParam({ name: 'id', description: 'Health record ID' })
  @ApiBody({ type: UpdateHealthRecordDto })
  @ApiResponse({
    status: 200,
    description: 'Health record updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Health record not found.' })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid input data.' })
  async update(@Param('id') id: string, @Body() updateHealthRecordDto: UpdateHealthRecordDto) {
    try {
      return await this.healthRecordService.update(id, updateHealthRecordDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Failed to update health record');
    }
  }

  @Put('/student/:studentId')
@HttpCode(HttpStatus.OK)
@ApiOperation({
  summary: 'Update health record by studentId',
  description: 'Updates an existing health record by studentId.',
})
@ApiResponse({ status: 200, description: 'Health record updated successfully.' })
@ApiResponse({ status: 404, description: 'Health record not found.' })
@ApiResponse({ status: 400, description: 'Bad request. Invalid input data.' })
async updatebyStudentId(
  @Param('studentId') studentId: string,
  @Body() updateHealthRecordDto: UpdateHealthRecordDto,
) {
  try {
    // Tìm health record theo studentId
    const healthRecord = await this.healthRecordService.getHealthRecordsByStudentId(studentId);
    if (!healthRecord) {
      throw new BadRequestException('Health record not found for this student');
    }
    // Update theo _id của health record
    return await this.healthRecordService.update(healthRecord._id, updateHealthRecordDto);
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw error;
    }
    throw new BadRequestException(error.message || 'Failed to update health record');
  }
}

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete health record',
    description: 'Deletes a health record by its ID. Admin only.',
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
