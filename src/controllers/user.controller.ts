import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiProperty, ApiParam } from '@nestjs/swagger';

class CreateUserDto {
  @ApiProperty({ example: 'Nguyen Van A', description: 'Tên người dùng' })
  name: string;

  @ApiProperty({ example: 'nva@example.com', description: 'Email người dùng' })
  email: string;
}

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo user mới' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User đã được tạo.' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto.name, createUserDto.email);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách user' })
  @ApiResponse({ status: 200, description: 'Danh sách user.' })
  async findAll() {
    return this.userService.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá user theo id' })
  @ApiParam({ name: 'id', description: 'ID của user' })
  @ApiResponse({ status: 200, description: 'User đã bị xoá.' })
  async delete(@Param('id') id: string) {
    return this.userService.deleteById(id);
  }
}
