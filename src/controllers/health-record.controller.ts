import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { HealthRecordService } from '@/services/health-record.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CreateHealthRecordDto } from '@/decorations/dto/create-health-record.dto';
import { UpdateHealthRecordDto } from '@/decorations/dto/update-health-record.dto';

@ApiTags('health-records')
@Controller('health-records')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class HealthRecordController {
  constructor(private readonly healthRecordService: HealthRecordService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách hồ sơ sức khỏe' })
  @ApiResponse({ status: 200, description: 'Danh sách hồ sơ sức khỏe.' })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền thực hiện thao tác này.',
  })
  async findAll() {
    return this.healthRecordService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin hồ sơ sức khỏe theo ID' })
  @ApiParam({ name: 'id', description: 'ID của hồ sơ sức khỏe' })
  @ApiResponse({ status: 200, description: 'Thông tin hồ sơ sức khỏe.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hồ sơ sức khỏe.' })
  async findOne(@Param('id') id: string) {
    return this.healthRecordService.findById(id);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Lấy hồ sơ sức khỏe theo ID sinh viên' })
  @ApiParam({ name: 'studentId', description: 'ID của sinh viên' })
  @ApiResponse({ status: 200, description: 'Thông tin hồ sơ sức khỏe.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hồ sơ sức khỏe.' })
  async findByStudentId(@Param('studentId') studentId: string) {
    return this.healthRecordService.findByStudentId(studentId);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo hồ sơ sức khỏe mới' })
  @ApiResponse({ status: 201, description: 'Hồ sơ sức khỏe đã được tạo.' })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền tạo hồ sơ sức khỏe.',
  })
  async create(@Body() createHealthRecordDto: CreateHealthRecordDto) {
    return this.healthRecordService.create(createHealthRecordDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin hồ sơ sức khỏe' })
  @ApiParam({ name: 'id', description: 'ID của hồ sơ sức khỏe' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin hồ sơ sức khỏe đã được cập nhật.',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hồ sơ sức khỏe.' })
  async update(
    @Param('id') id: string,
    @Body() updateHealthRecordDto: UpdateHealthRecordDto,
  ) {
    return this.healthRecordService.update(id, updateHealthRecordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa hồ sơ sức khỏe' })
  @ApiParam({ name: 'id', description: 'ID của hồ sơ sức khỏe' })
  @ApiResponse({ status: 200, description: 'Hồ sơ sức khỏe đã được xóa.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hồ sơ sức khỏe.' })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền xóa hồ sơ sức khỏe.',
  })
  async remove(@Param('id') id: string) {
    return this.healthRecordService.remove(id);
  }
}
