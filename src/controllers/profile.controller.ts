import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { ProfileDto, UpdateProfileWithoutUserDto } from '@/decorations/dto/profile.dto';


@ApiTags('profiles')
@Controller('profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo profile mới' })
  @ApiBody({ type: ProfileDto })
  @ApiResponse({ status: 201, description: 'Profile đã được tạo.' })
  async create(@Body() createProfileDto: ProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách profile' })
  @ApiResponse({ status: 200, description: 'Danh sách profile.' })
  async findAll() {
    return this.profileService.findAll();
  }

  @Get('user/:user')
  @ApiOperation({ summary: 'Lấy profile theo user' })
  @ApiParam({ name: 'user', description: 'ID của user' })
  @ApiResponse({ status: 200, description: 'Profile theo user.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy profile.' })
  async findByuser(@Param('user') user: string) {
    return this.profileService.findByuser(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy profile theo profile id' })
  @ApiParam({ name: 'id', description: 'ID của profile' })
  @ApiResponse({ status: 200, description: 'Profile theo id.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy profile.' })
  async findById(@Param('id') id: string) {
    return this.profileService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật profile theo id' })
  @ApiParam({ name: 'id', description: 'ID của profile' })
  @ApiBody({ type: ProfileDto })
  @ApiResponse({ status: 200, description: 'Profile đã được cập nhật.' })
  async update(@Param('id') id: string, @Body() updateProfileDto: ProfileDto) {
    return this.profileService.updateById(id, updateProfileDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá profile theo id' })
  @ApiParam({ name: 'id', description: 'ID của profile' })
  @ApiResponse({ status: 200, description: 'Profile đã bị xoá.' })
  async delete(@Param('id') id: string) {
    return this.profileService.deleteById(id);
  }

  @Put('user/:userId')
  @ApiOperation({ summary: 'Cập nhật profile theo userId' })
  @ApiParam({ name: 'userId', description: 'ID của user' })
  @ApiBody({ type: UpdateProfileWithoutUserDto })
  @ApiResponse({ status: 200, description: 'Profile đã được cập nhật theo userId.' })
  async updateByUserId(
    @Param('userId') userId: string,
    @Body() updateProfileDto: UpdateProfileWithoutUserDto,
  ) {
    return this.profileService.updateByUserId(userId, updateProfileDto);
  }
}
