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
import { StudentService } from '@/services/student.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CreateStudentDto } from '@/decorations/dto/create-student.dto';
import { UpdateStudentDto } from '@/decorations/dto/update-student.dto';

@ApiTags('students')
@Controller('students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // Apply guards at controller level
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách sinh viên' })
  @ApiResponse({ status: 200, description: 'Danh sách sinh viên.' })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền thực hiện thao tác này.',
  })
  async findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin sinh viên theo ID' })
  @ApiParam({ name: 'id', description: 'ID của sinh viên' })
  @ApiResponse({ status: 200, description: 'Thông tin sinh viên.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sinh viên.' })
  async findOne(@Param('id') id: string) {
    return this.studentService.findById(id);
  }  @Post()
  @ApiOperation({ summary: 'Tạo sinh viên mới' })
  @ApiResponse({ status: 201, description: 'Sinh viên đã được tạo.' })
  @ApiResponse({ status: 403, description: 'Không có quyền tạo sinh viên.' })
  async create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin sinh viên' })
  @ApiParam({ name: 'id', description: 'ID của sinh viên' })
  @ApiResponse({ status: 200, description: 'Thông tin sinh viên đã được cập nhật.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sinh viên.' })
  async update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa sinh viên' })
  @ApiParam({ name: 'id', description: 'ID của sinh viên' })
  @ApiResponse({ status: 200, description: 'Sinh viên đã được xóa.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sinh viên.' })
  @ApiResponse({ status: 403, description: 'Không có quyền xóa sinh viên.' })
  async remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }

}
