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
import { CreateUserDto } from '@/decorations/dto/user.dto';
import { UpdateUserDto } from '@/decorations/dto/update-user.dto';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { SuccessResponseDto } from '@/decorations/dto/success-response.dto';
import { PaginatedResponseDto } from '@/decorations/dto/paginated-response.dto';

@ApiTags('users✅')
@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy danh sách user' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách user.',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền thực hiện thao tác này.',
  })
  async findAll() {
    const users = await this.userService.findAll();
    // Example of using PaginatedResponseDto
    return new PaginatedResponseDto(
      users,
      {
        page: 1,
        limit: users.length,
        totalItems: users.length,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
      'Lấy danh sách user thành công',
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Tạo mới user' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Thông tin của user mới',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'User đã được tạo thành công.',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền thực hiện thao tác này.',
  })
  @ApiResponse({
    status: 400,
    description: 'Thông tin không hợp lệ hoặc đã tồn tại.',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.userService.create(createUserDto);
    return new SuccessResponseDto('User đã được tạo thành công', createdUser);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy thông tin user theo ID' })
  @ApiParam({ name: 'id', description: 'ID của user' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin user.',
    type: SuccessResponseDto,
  })
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

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cập nhật thông tin user' })
  @ApiParam({ name: 'id', description: 'ID của user' })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Thông tin cập nhật user',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'User đã được cập nhật thành công.',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy user.' })
  @ApiResponse({ status: 400, description: 'Thông tin không hợp lệ.' })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền thực hiện thao tác này.',
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // Validate ObjectId format
    if (id.length !== 24) {
      return {
        statusCode: 400,
        message:
          'Invalid ID format. MongoDB ObjectId must be 24 characters long.',
      };
    }
    try {
      return await this.userService.updateById(id, updateUserDto);
    } catch (error) {
      if (error.name === 'CastError') {
        return {
          statusCode: 400,
          message: 'Invalid ID format',
          error: 'Bad Request',
        };
      }
      throw error;
    }
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
