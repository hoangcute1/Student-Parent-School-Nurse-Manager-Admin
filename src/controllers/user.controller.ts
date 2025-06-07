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
import { UserService } from '@/services/user.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateUserDto } from '@/decorations/dto/create-user.dto';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';

@ApiTags('users✅')
@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy danh sách user' })
  @ApiResponse({ status: 200, description: 'Danh sách user.' })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền thực hiện thao tác này.',
  })
  async findAll() {
    return this.userService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Tạo mới user' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Thông tin của user mới',
    required: true,
  })
  @ApiResponse({ status: 201, description: 'User đã được tạo thành công.' })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền thực hiện thao tác này.',
  })
  @ApiResponse({
    status: 400,
    description: 'Thông tin không hợp lệ hoặc đã tồn tại.',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy thông tin user theo ID' })
  @ApiParam({ name: 'id', description: 'ID của user' })
  @ApiResponse({ status: 200, description: 'Thông tin user.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy user.' })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền thực hiện thao tác này.',
  })
  @ApiResponse({
    status: 400,
    description: 'ID không hợp lệ.',
  })
  async findOne(@Param('id') id: string) {
    // Validate ObjectId format
    if (id.length !== 24) {
      return {
        statusCode: 400,
        message:
          'Invalid ID format. MongoDB ObjectId must be 24 characters long.',
      };
    }

    try {
      return await this.userService.findById(id);
    } catch (error) {
      if (error.name === 'CastError') {
        return {
          statusCode: 400,
          message: 'Invalid ID format',
          error: 'Bad Request',
        };
      }
      throw error; // Re-throw other errors
    }
  }

  @Put(':id/role')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cập nhật vai trò của user' })
  @ApiParam({ name: 'id', description: 'ID của user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { roleName: { type: 'string', example: 'parent' } },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Vai trò của user đã được cập nhật.',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền thực hiện thao tác này.',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy user hoặc vai trò.',
  })
  async updateRole(
    @Param('id') id: string,
    @Body('roleName') roleName: string,
  ) {
    return this.userService.updateRole(id, roleName);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Xóa user theo id' })
  @ApiParam({ name: 'id', description: 'ID của user' })
  @ApiResponse({ status: 200, description: 'User đã bị xóa.' })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền thực hiện thao tác này.',
  })
  async delete(@Param('id') id: string) {
    return this.userService.deleteById(id);
  }

  @Get(':id/profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy thông tin profile của user' })
  @ApiParam({ name: 'id', description: 'ID của user' })
  @ApiResponse({ status: 200, description: 'Thông tin profile của user.' })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy user hoặc profile.',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền thực hiện thao tác này.',
  })
  async getUserProfile(@Param('id') id: string) {
    return this.userService.getUserProfile(id);
  }
}
