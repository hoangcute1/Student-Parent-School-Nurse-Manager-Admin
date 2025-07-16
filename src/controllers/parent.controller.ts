import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ParentService } from '@/services/parent.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CreateParentDto, CreateUserParentDto } from '@/decorations/dto/parent.dto';
import { UpdateParentDto } from '@/decorations/dto/parent.dto';
import { UserService } from '@/services/user.service';
import { SuccessResponseDto } from '@/decorations/dto/success-response.dto';

@ApiTags('parents')
@Controller('parents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ParentController {
  constructor(
    private readonly parentService: ParentService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách phụ huynh' })
  @ApiResponse({ status: 200, description: 'Danh sách phụ huynh.' })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền thực hiện thao tác này.',
  })
  async findAll() {
    return this.parentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin phụ huynh theo ID' })
  @ApiParam({ name: 'id', description: 'ID của phụ huynh' })
  @ApiResponse({ status: 200, description: 'Thông tin phụ huynh.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy phụ huynh.' })
  async findOne(@Param('id') id: string) {
    return this.parentService.findById(id);
  }
  @Post()
  @ApiOperation({ summary: 'Tạo phụ huynh mới' })
  @ApiResponse({ status: 201, description: 'Phụ huynh đã được tạo.' })
  @ApiResponse({ status: 403, description: 'Không có quyền tạo phụ huynh.' })
  async create(@Body() createParentDto: CreateParentDto) {
    return this.parentService.create(createParentDto);
  }

  @Post('/create-with-user')
  @ApiOperation({ summary: 'Tạo mới user phụ huynh' })
  @ApiBody({
    type: CreateUserParentDto,
    description: 'Thông tin của user phụ huynh mới',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'User phụ huynh đã được tạo thành công.',
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
  async createWithUser(@Body() createUserParentDto: CreateUserParentDto) {
    const result = await this.userService.createParent(createUserParentDto);
    return new SuccessResponseDto('User phụ huynh đã được tạo thành công', result);
  }

  @Post('/create-parent-with-user-profile')
  @ApiOperation({ summary: 'Tạo mới user, profile và parent cùng lúc' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
        name: { type: 'string' },
        phone: { type: 'string' },
        address: { type: 'string' },
        gender: { type: 'string' },
      },
      required: ['email', 'password', 'name', 'phone', 'address', 'gender'],
    },
    description: 'email, password cho user và các trường profile cho parent',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'User, profile và parent đã được tạo thành công.',
    type: SuccessResponseDto,
  })
  async createParentWithUserProfile(
    @Body()
    body: {
      email: string;
      password: string;
      name: string;
      phone: string;
      address: string;
      gender: string;
    },
  ) {
    let { email, password, name, phone, address, gender } = body;
    if (!email || !password || !name || !phone || !address || !gender) {
      throw new Error('Phải có đủ email, password, name, phone, address, gender');
    }
    // Map gender từ tiếng Việt sang enum
    if (gender.toLowerCase() === 'nam') gender = 'male';
    else if (gender.toLowerCase() === 'nữ' || gender.toLowerCase() === 'nu') gender = 'female';
    else if (gender.toLowerCase() === 'khác') gender = 'other';
    const userDto = { email, password };
    const profileDto = { name, phone, address, gender };
    const result = await this.parentService.createWithUser(userDto, profileDto);
    return new SuccessResponseDto('User, profile và parent đã được tạo thành công.', result);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin phụ huynh' })
  @ApiParam({ name: 'id', description: 'ID của phụ huynh' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin phụ huynh đã được cập nhật.',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy phụ huynh.' })
  async update(@Param('id') id: string, @Body() updateParentDto: UpdateParentDto) {
    return this.parentService.update(id, updateParentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa phụ huynh' })
  @ApiParam({ name: 'id', description: 'ID của phụ huynh' })
  @ApiResponse({ status: 200, description: 'Phụ huynh đã được xóa.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy phụ huynh.' })
  async remove(@Param('id') id: string) {
    return this.parentService.remove(id);
  }
}
