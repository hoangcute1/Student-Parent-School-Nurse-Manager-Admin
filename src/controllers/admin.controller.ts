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
import { AdminService } from '@/services/admin.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CreateAdminDto } from '@/decorations/dto/create-admin.dto';
import { UpdateAdminDto } from '../decorations/dto/update-admin.dto';

@ApiTags('admin')
@Controller('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách admin' })
  @ApiResponse({ status: 200, description: 'Danh sách admin.' })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền thực hiện thao tác này.',
  })
  async findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin admin theo ID' })
  @ApiParam({ name: 'id', description: 'ID của admin' })
  @ApiResponse({ status: 200, description: 'Thông tin admin.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy admin.' })
  async findOne(@Param('id') id: string) {
    return this.adminService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo mới admin' })
  @ApiResponse({ status: 201, description: 'Admin đã được tạo.' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ.' })
  async create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin admin' })
  @ApiParam({ name: 'id', description: 'ID của admin' })
  @ApiResponse({ status: 200, description: 'Admin đã được cập nhật.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy admin.' })
  async update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa admin theo id' })
  @ApiParam({ name: 'id', description: 'ID của admin' })
  @ApiResponse({ status: 200, description: 'Admin đã được xóa.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy admin.' })
  async remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
