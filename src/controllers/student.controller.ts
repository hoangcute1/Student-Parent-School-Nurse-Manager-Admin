import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { formatStudentResponse, StudentService } from '@/services/student.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { StudentDto } from '@/decorations/dto/student.dto';


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
    const result = await this.studentService.findAll();
    const formattedData = result.data.map((student) => formatStudentResponse(student));
    return {
      ...result,
      data: formattedData,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin sinh viên theo ID' })
  @ApiParam({ name: 'id', description: 'ID của sinh viên' })
  @ApiResponse({ status: 200, description: 'Thông tin sinh viên.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sinh viên.' })
  async findOne(@Param('id') id: string) {
    return await this.studentService.findById(id);
  }
  @Post()
  @ApiOperation({ summary: 'Tạo sinh viên mới' })
  @ApiResponse({ status: 201, description: 'Sinh viên đã được tạo.' })
  @ApiResponse({ status: 403, description: 'Không có quyền tạo sinh viên.' })
  async create(@Body() createStudentDto: StudentDto) {
    const student = await this.studentService.create(createStudentDto);
    return formatStudentResponse(student);
  }
  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin sinh viên' })
  @ApiParam({ name: 'id', description: 'ID của sinh viên' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin sinh viên đã được cập nhật.',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sinh viên.' })
  async update(@Param('id') id: string, @Body() updateStudentDto: StudentDto) {
    const student = await this.studentService.update(id, updateStudentDto);
    return formatStudentResponse(student);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa sinh viên' })
  @ApiParam({ name: 'id', description: 'ID của sinh viên' })
  @ApiResponse({ status: 200, description: 'Sinh viên đã được xóa.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sinh viên.' })
  @ApiResponse({ status: 403, description: 'Không có quyền xóa sinh viên.' })
  async remove(@Param('id') id: string) {
    const student = await this.studentService.remove(id);
    return formatStudentResponse(student);
  }

  @Get('parent/:parentId')
  @ApiOperation({ summary: 'Lấy danh sách học sinh theo parentId' })
  @ApiParam({ name: 'parentId', description: 'ID của phụ huynh' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách học sinh theo parentId.',
  })
  async findByParent(@Param('parentId') parentId: string) {
    const students = await this.studentService.findByParentId(parentId);
    return students.map((student) => formatStudentResponse(student));
  }

  @Get('class/:classId')
  @ApiOperation({ summary: 'Lấy danh sách học sinh theo classId' })
  @ApiParam({ name: 'classId', description: 'ID của lớp học' })
  @ApiResponse({ status: 200, description: 'Danh sách học sinh theo classId.' })
  async findByClass(@Param('classId') classId: string) {
    const students = await this.studentService.findByClassId(classId);
    return students.map((student) => formatStudentResponse(student));
  }

  @Get('grade/:gradeLevel')
  @ApiOperation({ summary: 'Lấy danh sách học sinh theo khối học' })
  @ApiParam({ name: 'gradeLevel', description: 'Khối học (1-5)' })
  @ApiResponse({ status: 200, description: 'Danh sách học sinh theo khối.' })
  async findByGradeLevel(@Param('gradeLevel') gradeLevel: string) {
    return await this.studentService.findByGradeLevel(parseInt(gradeLevel));
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm học sinh' })
  @ApiResponse({ status: 200, description: 'Kết quả tìm kiếm học sinh.' })
  async searchStudents(@Query('q') query: string) {
    return await this.studentService.searchStudents(query);
  }
}
