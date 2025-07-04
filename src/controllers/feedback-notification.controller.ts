import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { FeedbackNotificationService } from '@/services/feedback-notification.service';
import {
  CreateFeedbackNotificationDto,
  UpdateFeedbackNotificationDto,
} from '@/decorations/dto/feedback-notification.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { UserRole } from '@/schemas/feedback-notification.schema';

@ApiTags('feedback-notifications')
@Controller('feedback-notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FeedbackNotificationController {
  constructor(private readonly feedbackNotificationService: FeedbackNotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo thông báo feedback mới' })
  @ApiResponse({
    status: 201,
    description: 'Thông báo đã được tạo thành công.',
  })
  create(@Body() createDto: CreateFeedbackNotificationDto) {
    return this.feedbackNotificationService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả thông báo feedback' })
  findAll() {
    return this.feedbackNotificationService.findAll();
  }

  @Get('recipient/:recipientId')
  @ApiOperation({ summary: 'Lấy thông báo theo người nhận' })
  @ApiParam({ name: 'recipientId', description: 'ID của người nhận' })
  findByRecipient(@Param('recipientId') recipientId: string) {
    return this.feedbackNotificationService.findByRecipient(recipientId);
  }

  @Get('recipient/:recipientId/unread')
  @ApiOperation({ summary: 'Lấy thông báo chưa đọc của người nhận' })
  @ApiParam({ name: 'recipientId', description: 'ID của người nhận' })
  findUnreadByRecipient(@Param('recipientId') recipientId: string) {
    return this.feedbackNotificationService.findUnreadByRecipient(recipientId);
  }

  @Get('recipient/:recipientId/unread-count')
  @ApiOperation({ summary: 'Lấy số lượng thông báo chưa đọc' })
  @ApiParam({ name: 'recipientId', description: 'ID của người nhận' })
  getUnreadCount(@Param('recipientId') recipientId: string) {
    return this.feedbackNotificationService.getUnreadCount(recipientId);
  }

  @Get('role/:role')
  @ApiOperation({ summary: 'Lấy thông báo theo role' })
  @ApiParam({ name: 'role', description: 'Role của người nhận' })
  findByRole(@Param('role') role: UserRole) {
    return this.feedbackNotificationService.findByRole(role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết thông báo' })
  @ApiParam({ name: 'id', description: 'ID của thông báo' })
  findOne(@Param('id') id: string) {
    return this.feedbackNotificationService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông báo' })
  @ApiParam({ name: 'id', description: 'ID của thông báo' })
  update(@Param('id') id: string, @Body() updateDto: UpdateFeedbackNotificationDto) {
    return this.feedbackNotificationService.update(id, updateDto);
  }

  @Patch(':id/mark-read')
  @ApiOperation({ summary: 'Đánh dấu thông báo đã đọc' })
  @ApiParam({ name: 'id', description: 'ID của thông báo' })
  markAsRead(@Param('id') id: string) {
    return this.feedbackNotificationService.markAsRead(id);
  }

  @Patch('recipient/:recipientId/mark-all-read')
  @ApiOperation({ summary: 'Đánh dấu tất cả thông báo đã đọc' })
  @ApiParam({ name: 'recipientId', description: 'ID của người nhận' })
  async markAllAsRead(@Param('recipientId') recipientId: string) {
    await this.feedbackNotificationService.markAllAsReadByRecipient(recipientId);
    return { message: 'Đã đánh dấu tất cả thông báo là đã đọc' };
  }
}
