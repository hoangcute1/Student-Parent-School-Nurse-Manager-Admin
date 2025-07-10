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
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthExaminationService } from '@/services/health-examination.service';
import { ExaminationStatus } from '@/schemas/health-examination.schema';
import {
  CreateHealthExaminationDto,
  UpdateExaminationStatusDto,
} from '@/decorations/dto/health-examination.dto';

@Controller('health-examinations')
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
      const eventDetail =
        await this.healthExaminationService.getHealthExaminationEventDetail(eventId);
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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.healthExaminationService.findOne(id);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() updateDto: UpdateExaminationStatusDto) {
    return this.healthExaminationService.updateStatus(
      id,
      updateDto.status,
      updateDto.parent_response_notes,
      updateDto.rejection_reason,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.healthExaminationService.delete(id);
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
