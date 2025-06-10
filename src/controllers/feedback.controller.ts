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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';

@ApiTags('feedbacks')
@Controller('feedbacks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo phản hồi mới' })
  @ApiResponse({
    status: 201,
    description: 'Phản hồi đã được tạo thành công.',
  })
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách phản hồi' })
  async findAll() {
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
  update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    return this.feedbackService.update(id, updateFeedbackDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa phản hồi' })
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(id);
  }
}
