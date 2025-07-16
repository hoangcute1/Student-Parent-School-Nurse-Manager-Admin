import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { SimpleNotificationService } from '@/services/simple-notification.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateSimpleNotificationDto } from '@/decorations/dto/simple-notification.dto';

@ApiTags('simple-notifications')
@Controller('simple-notifications')
export class SimpleNotificationController {
  constructor(private readonly simpleNotificationService: SimpleNotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thông báo' })
  async findAll() {
    return this.simpleNotificationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin thông báo theo ID' })
  @ApiParam({ name: 'id', description: 'ID của thông báo' })
  async findOne(@Param('id') id: string) {
    return this.simpleNotificationService.findById(id);
  }

  @Get('parent/:parentId')
  @ApiOperation({ summary: 'Lấy thông báo theo ID phụ huynh' })
  @ApiParam({ name: 'parentId', description: 'ID của phụ huynh' })
  async findByParentId(@Param('parentId') parentId: string) {
    return this.simpleNotificationService.findByParentId(parentId);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Lấy thông báo theo ID học sinh' })
  @ApiParam({ name: 'studentId', description: 'ID của học sinh' })
  async findByStudentId(@Param('studentId') studentId: string) {
    return this.simpleNotificationService.findByStudentId(studentId);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo thông báo mới' })
  @ApiResponse({ status: 201, description: 'Thông báo đã được tạo.' })
  async create(@Body() createNotificationDto: CreateSimpleNotificationDto) {
    return this.simpleNotificationService.create(createNotificationDto);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Đánh dấu thông báo đã đọc' })
  @ApiParam({ name: 'id', description: 'ID của thông báo' })
  async markAsRead(@Param('id') id: string) {
    return this.simpleNotificationService.markAsRead(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa thông báo' })
  @ApiParam({ name: 'id', description: 'ID của thông báo' })
  async remove(@Param('id') id: string) {
    return this.simpleNotificationService.remove(id);
  }
}
