import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ClassService } from '@/services/class.service';
import { CreateClassDto } from '@/decorations/dto/class.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('classes')
@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo lớp học mới' })
  @ApiResponse({ status: 201, description: 'Lớp học đã được tạo.' })
  async create(@Body() createClassDto: CreateClassDto) {
    return this.classService.create(createClassDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách lớp học' })
  async findAll() {
    return this.classService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin lớp học theo ID' })
  @ApiParam({ name: 'id', description: 'ID của lớp học' })
  async findOne(@Param('id') id: string) {
    return this.classService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin lớp học' })
  @ApiParam({ name: 'id', description: 'ID của lớp học' })
  async update(
    @Param('id') id: string,
    @Body() updateClassDto: CreateClassDto,
  ) {
    return this.classService.update(id, updateClassDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa lớp học' })
  @ApiParam({ name: 'id', description: 'ID của lớp học' })
  async remove(@Param('id') id: string) {
    return this.classService.remove(id);
  }
}
