import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FeedbackService } from '@/services/feedback.service';
import {
  CreateFeedbackDto,
  UpdateFeedbackDto,
  FilterFeedbackDto,
} from '@/decorations/dto/feedback.dto';
import { RespondToFeedbackDto } from '@/decorations/dto/respond-to-feedback.dto';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';

@ApiTags('feedbacks')
@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('test-no-auth')
  @ApiOperation({ summary: 'Test tạo feedback không cần auth' })
  async createTestFeedback(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get('test-no-auth')
  @ApiOperation({ summary: 'Test lấy feedbacks không cần auth' })
  async getTestFeedbacks() {
    return this.feedbackService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Tạo feedback mới' })
  @ApiResponse({
    status: 201,
    description: 'Feedback đã được tạo thành công.',
  })
  async create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả feedback' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách feedback.',
  })
  async findAll(@Query() filterDto: FilterFeedbackDto) {
    return this.feedbackService.findAll();
  }

  @Get('parent/:id')
  @ApiOperation({ summary: 'Lấy danh sách phản hồi của một phụ huynh' })
  findByParent(@Param('id') id: string) {
    return this.feedbackService.findByParent(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một phản hồi' })
  findOne(@Param('id') id: string) {
    return this.feedbackService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật phản hồi (trả lời phản hồi)' })
  update(@Param('id') id: string, @Body() updateFeedbackDto: UpdateFeedbackDto) {
    return this.feedbackService.update(id, updateFeedbackDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa phản hồi' })
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(id);
  }

  @Post(':id/respond')
  @ApiOperation({ summary: 'Nhân viên phản hồi feedback' })
  @ApiResponse({
    status: 200,
    description: 'Phản hồi đã được gửi thành công.',
  })
  async respondToFeedback(@Param('id') id: string, @Body() respondDto: RespondToFeedbackDto) {
    return this.feedbackService.respondToFeedback(id, respondDto.responderId, respondDto.response);
  }

  @Patch(':id/update-response')
  @ApiOperation({ summary: 'Cập nhật phản hồi feedback' })
  @ApiResponse({
    status: 200,
    description: 'Phản hồi đã được cập nhật thành công.',
  })
  async updateResponse(
    @Param('id') id: string,
    @Body() updateDto: { response: string; responderId: string },
  ) {
    return this.feedbackService.updateResponse(id, updateDto.responderId, updateDto.response);
  }
}
