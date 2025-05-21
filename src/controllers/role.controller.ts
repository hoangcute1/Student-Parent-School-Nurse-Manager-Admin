import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RoleService } from '@/services/role.service';
import { CreateRoleDto } from '@/decorations/dto/create-role.dto';
import { UpdateRoleDto } from '@/decorations/dto/update-role.dto';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('roles✅')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo vai trò mới' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ status: 201, description: 'Vai trò đã được tạo thành công.' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ.' })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền thực hiện thao tác này.',
  })
  @ApiResponse({ status: 409, description: 'Vai trò đã tồn tại.' })
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả vai trò' })
  @ApiResponse({ status: 200, description: 'Danh sách vai trò.' })
  async findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin vai trò theo ID' })
  @ApiParam({ name: 'id', description: 'ID của vai trò' })
  @ApiResponse({ status: 200, description: 'Thông tin vai trò.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vai trò.' })
  async findOne(@Param('id') id: string) {
    return this.roleService.findById(id);
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Lấy thông tin vai trò theo tên' })
  @ApiParam({ name: 'name', description: 'Tên của vai trò' })
  @ApiResponse({ status: 200, description: 'Thông tin vai trò.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vai trò.' })
  async findByName(@Param('name') name: string) {
    return this.roleService.findByName(name);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin vai trò' })
  @ApiParam({ name: 'id', description: 'ID của vai trò' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({
    status: 200,
    description: 'Thông tin vai trò đã được cập nhật.',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền thực hiện thao tác này.',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vai trò.' })
  @ApiResponse({ status: 409, description: 'Tên vai trò đã tồn tại.' })
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa vai trò' })
  @ApiParam({ name: 'id', description: 'ID của vai trò' })
  @ApiResponse({ status: 200, description: 'Vai trò đã bị xóa.' })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền thực hiện thao tác này.',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vai trò.' })
  @ApiResponse({ status: 409, description: 'Không thể xóa vai trò mặc định.' })
  async delete(@Param('id') id: string) {
    return this.roleService.delete(id);
  }

  @Post(':id/permissions')
  @ApiOperation({ summary: 'Thêm quyền cho vai trò' })
  @ApiParam({ name: 'id', description: 'ID của vai trò' })
  @ApiBody({
    schema: { type: 'object', properties: { permission: { type: 'string' } } },
  })
  @ApiResponse({ status: 200, description: 'Quyền đã được thêm.' })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền thực hiện thao tác này.',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vai trò.' })
  async addPermission(
    @Param('id') id: string,
    @Body('permission') permission: string,
  ) {
    return this.roleService.addPermission(id, permission);
  }

  @Delete(':id/permissions/:permission')
  @ApiOperation({ summary: 'Xóa quyền của vai trò' })
  @ApiParam({ name: 'id', description: 'ID của vai trò' })
  @ApiParam({ name: 'permission', description: 'Tên quyền cần xóa' })
  @ApiResponse({ status: 200, description: 'Quyền đã được xóa.' })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền thực hiện thao tác này.',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vai trò.' })
  async removePermission(
    @Param('id') id: string,
    @Param('permission') permission: string,
  ) {
    return this.roleService.removePermission(id, permission);
  }
}
