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
import { StaffService } from '@/services/staff.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CreateStaffDto } from '@/decorations/dto/create-staff.dto';
import { UpdateStaffDto } from '@/decorations/dto/update-staff.dto';
import { UserService } from '@/services/user.service';
import { CreateUserStaffDto } from '@/decorations/dto/create-user-staff.dto';
import { SuccessResponseDto } from '@/decorations/dto/success-response.dto';

@ApiTags('staff')
@Controller('staff')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class StaffController {
  constructor(
    private readonly staffService: StaffService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách nhân viên' })
  @ApiResponse({ status: 200, description: 'Danh sách nhân viên.' })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền thực hiện thao tác này.',
  })
  async findAll() {
    return this.staffService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin nhân viên theo ID' })
  @ApiParam({ name: 'id', description: 'ID của nhân viên' })
  @ApiResponse({ status: 200, description: 'Thông tin nhân viên.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhân viên.' })
  async findOne(@Param('id') id: string) {
    return this.staffService.findById(id);
  }
  @Post()
  @ApiOperation({ summary: 'Tạo nhân viên mới' })
  @ApiResponse({ status: 201, description: 'Nhân viên đã được tạo.' })
  @ApiResponse({ status: 403, description: 'Không có quyền tạo nhân viên.' })
  async create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }

  @Post('/create-with-user')
  @ApiOperation({ summary: 'Tạo mới user nhân viên' })
  @ApiBody({
    type: CreateUserStaffDto,
    description: 'Thông tin của user nhân viên mới',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'User nhân viên đã được tạo thành công.',
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
  async createWithUser(@Body() createUserStaffDto: CreateUserStaffDto) {
    const result = await this.userService.createStaff(createUserStaffDto);
    return new SuccessResponseDto(
      'User nhân viên đã được tạo thành công',
      result,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin nhân viên' })
  @ApiParam({ name: 'id', description: 'ID của nhân viên' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin nhân viên đã được cập nhật.',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhân viên.' })
  async update(
    @Param('id') id: string,
    @Body() updateStaffDto: UpdateStaffDto,
  ) {
    return this.staffService.update(id, updateStaffDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa nhân viên' })
  @ApiParam({ name: 'id', description: 'ID của nhân viên' })
  @ApiResponse({ status: 200, description: 'Nhân viên đã được xóa.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhân viên.' })
  async remove(@Param('id') id: string) {
    return this.staffService.remove(id);
  }
}
