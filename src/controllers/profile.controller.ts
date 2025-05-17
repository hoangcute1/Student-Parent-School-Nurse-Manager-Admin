import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiProperty } from '@nestjs/swagger';

class CreateProfileDto {
  @ApiProperty({ example: 'Nguyen Van B', description: 'Tên profile' })
  name: string;
  @ApiProperty({ example: '123 Đường ABC', description: 'Địa chỉ' })
  address: string;
  @ApiProperty({ example: 25, description: 'Tuổi' })
  age: number;
  @ApiProperty({ example: 'b@example.com', description: 'Email' })
  email: string;
}

class UpdateProfileDto {
  @ApiProperty({ example: 'Nguyen Van B', required: false })
  name?: string;
  @ApiProperty({ example: '123 Đường ABC', required: false })
  address?: string;
  @ApiProperty({ example: 25, required: false })
  age?: number;
  @ApiProperty({ example: 'b@example.com', required: false })
  email?: string;
}

@ApiTags('profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo profile mới' })
  @ApiBody({ type: CreateProfileDto })
  @ApiResponse({ status: 201, description: 'Profile đã được tạo.' })
  async create(@Body() dto: CreateProfileDto) {
    return this.profileService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách profile' })
  @ApiResponse({ status: 200, description: 'Danh sách profile.' })
  async findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy profile theo id' })
  @ApiParam({ name: 'id', description: 'ID của profile' })
  @ApiResponse({ status: 200, description: 'Profile theo id.' })
  async findById(@Param('id') id: string) {
    return this.profileService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật profile theo id' })
  @ApiParam({ name: 'id', description: 'ID của profile' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'Profile đã được cập nhật.' })
  async update(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateById(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá profile theo id' })
  @ApiParam({ name: 'id', description: 'ID của profile' })
  @ApiResponse({ status: 200, description: 'Profile đã bị xoá.' })
  async delete(@Param('id') id: string) {
    return this.profileService.deleteById(id);
  }
}
