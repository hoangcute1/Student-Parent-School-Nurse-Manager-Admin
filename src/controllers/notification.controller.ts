import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { NotificationService } from '@/services/notification.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateNotificationDto } from '@/decorations/dto/create-notification.dto';
import { UpdateNotificationDto } from '@/decorations/dto/update-notification.dto';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thông báo' })
  async findAll() {
    return this.notificationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin thông báo theo ID' })
  @ApiParam({ name: 'id', description: 'ID của thông báo' })
  async findOne(@Param('id') id: string) {
    return this.notificationService.findById(id);
  }

  @Get('parent/:parentId')
  @ApiOperation({ summary: 'Lấy thông báo theo ID phụ huynh' })
  @ApiParam({ name: 'parentId', description: 'ID của phụ huynh' })
  async findByParentId(@Param('parentId') parentId: string) {
    return this.notificationService.findByParentId(parentId);
  }
  @Get('student/:studentId')
  @ApiOperation({ summary: 'Lấy thông báo theo ID học sinh' })
  @ApiParam({ name: 'studentId', description: 'ID của học sinh' })
  async findByStudentId(@Param('studentId') studentId: string) {
    return this.notificationService.findByStudentId(studentId);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo thông báo mới' })
  @ApiResponse({ status: 201, description: 'Thông báo đã được tạo.' })
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin thông báo' })
  @ApiParam({ name: 'id', description: 'ID của thông báo' })
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa thông báo' })
  @ApiParam({ name: 'id', description: 'ID của thông báo' })
  async remove(@Param('id') id: string) {
    return this.notificationService.remove(id);
  }
}
