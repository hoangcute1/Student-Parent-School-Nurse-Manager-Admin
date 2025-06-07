import {
  Controller,
  Get,
  Post,
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

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa admin' })
  @ApiParam({ name: 'id', description: 'ID của admin' })
  @ApiResponse({ status: 200, description: 'Admin đã được xóa.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy admin.' })
  async remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
