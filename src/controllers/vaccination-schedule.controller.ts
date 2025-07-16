import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  BadRequestException,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { VaccinationScheduleService } from '@/services/vaccination-schedule.service';
import { CreateVaccinationScheduleDto } from '@/decorations/dto/vaccination-schedule.dto';

@ApiTags('vaccination-schedules')
@Controller('vaccination-schedules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class VaccinationScheduleController {
  constructor(private readonly vaccinationScheduleService: VaccinationScheduleService) {}

  @Get()
  @ApiOperation({ summary: 'Get all vaccination schedules' })
  @ApiResponse({ status: 200, description: 'Return all vaccination schedules.' })
  async getAllSchedules() {
    return this.vaccinationScheduleService.getAllSchedules();
  }

  @Post()
  @ApiOperation({ summary: 'Create new vaccination schedule(s)' })
  @ApiResponse({ status: 201, description: 'Vaccination schedule(s) created.' })
  async createVaccinationSchedule(@Body() createData: CreateVaccinationScheduleDto) {
    console.log('Received payload:', createData); // Log payload
    try {
      const vaccinationDate = new Date(createData.vaccination_date);
      const vaccinations = await this.vaccinationScheduleService.createVaccinationSchedule(
        createData.title,
        createData.description,
        vaccinationDate,
        createData.vaccination_time,
        createData.location || '',
        createData.doctor_name || '',
        createData.vaccine_type || '',
        createData.student_ids,
        createData.grade_level,
      );
      return vaccinations;
    } catch (error) {
      console.error('Error creating vaccination schedule:', error); // Log error
      throw new BadRequestException(error.message || 'Không thể tạo lịch tiêm chủng');
    }
  }

  @Get('events')
  @ApiOperation({ summary: 'Get all vaccination events' })
  @ApiResponse({ status: 200, description: 'Return all vaccination events.' })
  async getVaccinationEvents() {
    try {
      const events = await this.vaccinationScheduleService.getVaccinationEvents();
      return events;
    } catch (error) {
      throw new BadRequestException('Không thể lấy danh sách sự kiện tiêm chủng');
    }
  }

  @Get('events/:eventId')
  @ApiOperation({ summary: 'Get vaccination event detail' })
  @ApiParam({ name: 'eventId', description: 'Vaccination event ID' })
  @ApiResponse({ status: 200, description: 'Return vaccination event detail.' })
  async getVaccinationEventDetail(
    @Param('eventId') eventId: string,
    @Query('staffId') staffId?: string,
  ) {
    try {
      const eventDetail = await this.vaccinationScheduleService.getVaccinationEventDetail(eventId);
      return eventDetail;
    } catch (error) {
      throw new BadRequestException('Không thể lấy chi tiết sự kiện tiêm chủng');
    }
  }

  @Get('events/:eventId/classes/:classId')
  @ApiOperation({ summary: 'Get vaccination class detail' })
  @ApiParam({ name: 'eventId', description: 'Vaccination event ID' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Return vaccination class detail.' })
  async getVaccinationClassDetail(
    @Param('eventId') eventId: string,
    @Param('classId') classId: string,
  ) {
    try {
      const classDetail = await this.vaccinationScheduleService.getVaccinationClassDetail(
        eventId,
        classId,
      );
      return classDetail;
    } catch (error) {
      throw new BadRequestException('Không thể lấy chi tiết lớp học');
    }
  }

  @Put(':vaccinationId/result')
  @ApiOperation({ summary: 'Update vaccination result' })
  @ApiParam({ name: 'vaccinationId', description: 'Vaccination ID' })
  @ApiResponse({
    status: 200,
    description: 'Vaccination result has been updated.',
  })
  async updateVaccinationResult(
    @Param('vaccinationId') vaccinationId: string,
    @Body()
    updateData: {
      vaccination_result?: string;
      vaccination_notes?: string;
      recommendations?: string;
      follow_up_required?: boolean;
      follow_up_date?: string;
    },
  ) {
    try {
      const followUpDate = updateData.follow_up_date
        ? new Date(updateData.follow_up_date)
        : undefined;

      const updatedVaccination = await this.vaccinationScheduleService.updateVaccinationResult(
        vaccinationId,
        {
          ...updateData,
          follow_up_date: followUpDate,
        },
      );
      return updatedVaccination;
    } catch (error) {
      throw new BadRequestException('Không thể cập nhật kết quả tiêm chủng');
    }
  }

  @Put(':vaccinationId/approve')
  @ApiOperation({ summary: 'Approve a pending vaccination schedule' })
  @ApiParam({ name: 'vaccinationId', description: 'Vaccination Schedule ID' })
  @ApiResponse({ status: 200, description: 'Vaccination schedule approved.' })
  async approveVaccinationSchedule(@Param('vaccinationId') vaccinationId: string) {
    try {
      return await this.vaccinationScheduleService.approveVaccinationSchedule(vaccinationId);
    } catch (error) {
      throw new HttpException(
        'Không thể xác nhận lịch tiêm chủng',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':vaccinationId/cancel')
  @ApiOperation({ summary: 'Reject/cancel a pending vaccination schedule' })
  @ApiParam({ name: 'vaccinationId', description: 'Vaccination Schedule ID' })
  @ApiResponse({ status: 200, description: 'Vaccination schedule rejected.' })
  async cancelVaccinationSchedule(@Param('vaccinationId') vaccinationId: string) {
    try {
      return await this.vaccinationScheduleService.cancelVaccinationSchedule(vaccinationId);
    } catch (error) {
      throw new HttpException(
        'Không thể từ chối lịch tiêm chủng',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':vaccinationId')
  @ApiOperation({ summary: 'Delete vaccination schedule' })
  @ApiParam({ name: 'vaccinationId', description: 'Vaccination ID' })
  @ApiResponse({
    status: 200,
    description: 'Vaccination schedule has been deleted.',
  })
  async deleteVaccinationSchedule(@Param('vaccinationId') vaccinationId: string) {
    try {
      const result = await this.vaccinationScheduleService.deleteVaccinationSchedule(vaccinationId);
      return result;
    } catch (error) {
      throw new BadRequestException('Không thể xóa lịch tiêm chủng');
    }
  }

  @Get('results/student/:studentId')
  @UseGuards(JwtAuthGuard)
  async getVaccinationResultsByStudent(@Param('studentId') studentId: string) {
    try {
      return await this.vaccinationScheduleService.getVaccinationResultsByStudent(studentId);
    } catch (error) {
      throw new HttpException('Không thể lấy kết quả tiêm chủng', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('pending/student/:studentId')
  @ApiOperation({ summary: 'Get all pending vaccination schedules for a student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Return all pending vaccination schedules for the student.',
  })
  async getPendingVaccinationSchedulesByStudent(@Param('studentId') studentId: string) {
    try {
      return await this.vaccinationScheduleService.getPendingVaccinationSchedulesByStudent(
        studentId,
      );
    } catch (error) {
      throw new HttpException(
        'Không thể lấy lịch tiêm chủng đang chờ',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
