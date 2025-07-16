import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ParentStudentService } from '@/services/parent-student.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CreateParentStudentDto } from '@/decorations/dto/parent-student.dto';
import { UpdateParentStudentDto } from '@/decorations/dto/update-parent-student.dto';

@ApiTags('parent-students')
@Controller('parent-students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ParentStudentController {
  constructor(private readonly parentStudentService: ParentStudentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all parent-student relationships' })
  @ApiResponse({
    status: 200,
    description: 'Return all parent-student relationships.',
  })
  async findAll() {
    return this.parentStudentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a parent-student relationship by ID' })
  @ApiParam({ name: 'id', description: 'Parent-Student relationship ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the parent-student relationship.',
  })
  @ApiResponse({
    status: 404,
    description: 'Parent-Student relationship not found.',
  })
  async findOne(@Param('id') id: string) {
    return this.parentStudentService.findById(id);
  }

  @Get('parent/:userId')
  @ApiOperation({ summary: 'Get parent-student relationships by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Return parent-student relationships for a parent.',
  })
  async findByParentId(@Param('userId') userId: string) {
    return this.parentStudentService.findByUserId(userId);
  }

  

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get parent-student relationships by student ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Return parent-student relationships for a student.',
  })
  async findByStudentId(@Param('studentId') studentId: string) {
    return this.parentStudentService.findByStudentId(studentId);
  }



  @Post()
  @ApiOperation({ summary: 'Create a new parent-student relationship' })
  @ApiResponse({
    status: 201,
    description: 'The parent-student relationship has been created.',
  })
  async create(@Body() createParentStudentDto: CreateParentStudentDto) {
    return this.parentStudentService.create(createParentStudentDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a parent-student relationship' })
  @ApiParam({ name: 'id', description: 'Parent-Student relationship ID' })
  @ApiResponse({
    status: 200,
    description: 'The parent-student relationship has been updated.',
  })
  @ApiResponse({
    status: 404,
    description: 'Parent-Student relationship not found.',
  })
  async update(@Param('id') id: string, @Body() updateParentStudentDto: UpdateParentStudentDto) {
    return this.parentStudentService.update(id, updateParentStudentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a parent-student relationship' })
  @ApiParam({ name: 'id', description: 'Parent-Student relationship ID' })
  @ApiResponse({
    status: 200,
    description: 'The parent-student relationship has been deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Parent-Student relationship not found.',
  })
  async remove(@Param('id') id: string) {
    return this.parentStudentService.remove(id);
  }
}
