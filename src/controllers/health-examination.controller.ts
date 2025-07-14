import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HealthExaminationService } from '@/services/health-examination.service';
import { ExaminationStatus } from '@/schemas/health-examination.schema';
import {
  CreateHealthExaminationDto,
  UpdateExaminationStatusDto,
  ScheduleConsultationDto,
} from '@/decorations/dto/health-examination.dto';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';

@ApiTags('health-examinations')
@Controller('health-examinations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class HealthExaminationController {
  constructor(private readonly healthExaminationService: HealthExaminationService) {}

  @Post()
  async create(@Body() createDto: CreateHealthExaminationDto, @Query('staffId') staffId: string) {
    return this.healthExaminationService.create(createDto, staffId);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.healthExaminationService.findAll(query);
  }

  @Get('student/:studentId/completed')
  @ApiOperation({ summary: 'Get completed health examinations for a student' })
  @ApiResponse({ status: 200, description: 'Completed health examinations retrieved successfully' })
  async getCompletedExaminationsByStudent(@Param('studentId') studentId: string) {
    try {
      const examinations =
        await this.healthExaminationService.getCompletedExaminationsByStudent(studentId);
      return examinations;
    } catch (error) {
      throw new BadRequestException('Không thể lấy danh sách kết quả khám sức khỏe');
    }
  }

  @Get('student/:studentId/pending')
  @ApiOperation({ summary: 'Get pending health examinations for a student' })
  @ApiResponse({ status: 200, description: 'Pending health examinations retrieved successfully' })
  async getPendingExaminationsByStudent(@Param('studentId') studentId: string) {
    try {
      const examinations =
        await this.healthExaminationService.getPendingExaminationsByStudent(studentId);
      return examinations;
    } catch (error) {
      throw new BadRequestException('Không thể lấy danh sách lịch khám đang chờ xử lý');
    }
  }

  @Patch('student/:studentId/examination/:examinationId/approve')
  @ApiOperation({ summary: 'Approve a specific health examination for a student' })
  @ApiResponse({ status: 200, description: 'Health examination approved successfully' })
  async approveExaminationByStudent(
    @Param('studentId') studentId: string,
    @Param('examinationId') examinationId: string,
  ) {
    try {
      const result = await this.healthExaminationService.approveExaminationByStudent(
        studentId,
        examinationId,
      );
      return result;
    } catch (error) {
      throw new BadRequestException('Không thể phê duyệt lịch khám sức khỏe');
    }
  }

  @Patch('student/:studentId/examination/:examinationId/cancel')
  @ApiOperation({ summary: 'Cancel a specific health examination for a student' })
  @ApiResponse({ status: 200, description: 'Health examination cancelled successfully' })
  async cancelExaminationByStudent(
    @Param('studentId') studentId: string,
    @Param('examinationId') examinationId: string,
  ) {
    try {
      const result = await this.healthExaminationService.cancelExaminationByStudent(
        studentId,
        examinationId,
      );
      return result;
    } catch (error) {
      throw new BadRequestException('Không thể hủy lịch khám sức khỏe');
    }
  }

  @Get('approved')
  async getApprovedExaminations(@Query('staffId') staffId?: string) {
    try {
      const examinations = await this.healthExaminationService.getApprovedExaminations();
      return examinations;
    } catch (error) {
      throw new BadRequestException('Không thể lấy danh sách lịch khám đã được duyệt');
    }
  }

  @Get('events')
  @ApiOperation({ summary: 'Get health examination events grouped by campaign' })
  @ApiResponse({ status: 200, description: 'Health examination events retrieved successfully' })
  async getHealthExaminationEvents(@Query('staffId') staffId?: string) {
    try {
      const events = await this.healthExaminationService.getHealthExaminationEvents();
      return events;
    } catch (error) {
      throw new BadRequestException('Không thể lấy danh sách sự kiện khám sức khỏe');
    }
  }

  @Get('events/:eventId')
  @ApiOperation({ summary: 'Get health examination event detail with classes' })
  @ApiResponse({
    status: 200,
    description: 'Health examination event detail retrieved successfully',
  })
  async getHealthExaminationEventDetail(
    @Param('eventId') eventId: string,
    @Query('staffId') staffId?: string,
  ) {
    try {
      // Giải mã eventId nếu FE có encodeURIComponent
      const decodedEventId = decodeURIComponent(eventId);
      const eventDetail =
        await this.healthExaminationService.getHealthExaminationEventDetail(decodedEventId);
      return eventDetail;
    } catch (error) {
      throw new BadRequestException('Không thể lấy chi tiết sự kiện khám sức khỏe');
    }
  }

  @Get('events/:eventId/classes/:classId')
  @ApiOperation({ summary: 'Get health examination class detail with students' })
  @ApiResponse({
    status: 200,
    description: 'Health examination class detail retrieved successfully',
  })
  async getHealthExaminationClassDetail(
    @Param('eventId') eventId: string,
    @Param('classId') classId: string,
    @Query('staffId') staffId?: string,
  ) {
    try {
      const classDetail = await this.healthExaminationService.getHealthExaminationClassDetail(
        eventId,
        classId,
      );
      return classDetail;
    } catch (error) {
      throw new BadRequestException('Không thể lấy chi tiết lớp học trong sự kiện khám sức khỏe');
    }
  }

  @Patch(':id/result')
  @ApiOperation({ summary: 'Update health examination result' })
  @ApiResponse({ status: 200, description: 'Health examination result updated successfully' })
  async updateHealthExaminationResult(
    @Param('id') id: string,
    @Body()
    updateData: {
      health_result?: string;
      examination_notes?: string;
      recommendations?: string;
      follow_up_required?: boolean;
      follow_up_date?: string;
    },
  ) {
    try {
      const processedData = {
        ...updateData,
        follow_up_date: updateData.follow_up_date ? new Date(updateData.follow_up_date) : undefined,
      };

      const result = await this.healthExaminationService.updateHealthExaminationResult(
        id,
        processedData,
      );
      return result;
    } catch (error) {
      throw new BadRequestException('Không thể cập nhật kết quả khám sức khỏe');
    }
  }

  @Get('consultations')
  @ApiOperation({ summary: 'Get all consultation appointments' })
  @ApiResponse({ status: 200, description: 'Consultation appointments retrieved successfully' })
  async getConsultationAppointments(@Query('studentId') studentId?: string) {
    try {
      const consultations =
        await this.healthExaminationService.getConsultationAppointments(studentId);
      return consultations;
    } catch (error) {
      throw new BadRequestException('Không thể lấy danh sách lịch hẹn tư vấn');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.healthExaminationService.findOne(id);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() updateDto: UpdateExaminationStatusDto) {
    return this.healthExaminationService.updateStatus(id, updateDto.status);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.healthExaminationService.delete(id);
  }

  @Post('schedule-consultation')
  @ApiOperation({ summary: 'Schedule a consultation for a student' })
  @ApiResponse({ status: 201, description: 'Consultation scheduled successfully' })
  async scheduleConsultation(
    @Body() scheduleDto: ScheduleConsultationDto,
    @Query('studentId') studentId: string,
    @Req() req: any,
  ) {
    try {
      console.log('Controller received request:', { scheduleDto, studentId });
      console.log('Request headers:', req.headers);
      console.log('Request user object:', req.user);
      console.log('Request user type:', typeof req.user);
      console.log('Request user keys:', req.user ? Object.keys(req.user) : 'null');

      if (!studentId) {
        throw new BadRequestException('studentId query parameter is required');
      }

      // Get staff ID from JWT token
      const staffId = req.user?.user || req.user?.sub || req.user?.id;
      console.log('Staff ID from token:', staffId);
      console.log('Staff ID type:', typeof staffId);

      if (!staffId) {
        console.error('No staff ID found in JWT token');
        console.error('Available user properties:', req.user);
        throw new BadRequestException('Không tìm thấy thông tin người dùng trong token');
      }

      const result = await this.healthExaminationService.scheduleConsultation({
        ...scheduleDto,
        student_id: studentId,
        created_by: staffId,
      });
      return result;
    } catch (error) {
      console.error('Controller error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Không thể lập lịch hẹn tư vấn');
    }
  }

  @Delete('events/:eventId')
  @ApiOperation({ summary: 'Delete all health examinations for an event' })
  @ApiResponse({
    status: 200,
    description: 'Event and all related health examinations deleted successfully',
  })
  async deleteEvent(@Param('eventId') eventId: string) {
    try {
      const result = await this.healthExaminationService.deleteEvent(eventId);
      return result;
    } catch (error) {
      throw new BadRequestException('Không thể xóa sự kiện khám sức khỏe');
    }
  }
}
