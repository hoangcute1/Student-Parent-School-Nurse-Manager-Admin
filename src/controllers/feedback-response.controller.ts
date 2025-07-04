import { Controller, Get, Post, Patch, Param, Body, Delete, UseGuards } from '@nestjs/common';
import { FeedbackResponseService } from '@/services/feedback-response.service';
import {
  CreateFeedbackResponseDto,
  UpdateFeedbackResponseDto,
} from '@/decorations/dto/feedback-response.dto';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';

@ApiTags('feedback-responses')
@Controller('feedback-responses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FeedbackResponseController {
  constructor(private readonly feedbackResponseService: FeedbackResponseService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo phản hồi feedback mới' })
  @ApiResponse({
    status: 201,
    description: 'Phản hồi đã được tạo thành công.',
  })
  create(@Body() createDto: CreateFeedbackResponseDto) {
    return this.feedbackResponseService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả phản hồi feedback' })
  findAll() {
    return this.feedbackResponseService.findAll();
  }

  @Get('feedback/:feedbackId')
  @ApiOperation({ summary: 'Lấy phản hồi theo feedback' })
  @ApiParam({ name: 'feedbackId', description: 'ID của feedback' })
  findByFeedback(@Param('feedbackId') feedbackId: string) {
    return this.feedbackResponseService.findByFeedback(feedbackId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết phản hồi' })
  @ApiParam({ name: 'id', description: 'ID của phản hồi' })
  findOne(@Param('id') id: string) {
    return this.feedbackResponseService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật phản hồi' })
  @ApiParam({ name: 'id', description: 'ID của phản hồi' })
  update(@Param('id') id: string, @Body() updateDto: UpdateFeedbackResponseDto) {
    return this.feedbackResponseService.update(id, updateDto);
  }

  @Patch(':id/mark-read')
  @ApiOperation({ summary: 'Đánh dấu phản hồi đã đọc' })
  @ApiParam({ name: 'id', description: 'ID của phản hồi' })
  markAsRead(@Param('id') id: string) {
    return this.feedbackResponseService.markAsRead(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa phản hồi' })
  @ApiParam({ name: 'id', description: 'ID của phản hồi' })
  remove(@Param('id') id: string) {
    return this.feedbackResponseService.remove(id);
  }
}
