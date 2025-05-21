import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ConditionService } from '../services/condition.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiProperty } from '@nestjs/swagger';

class CreateConditionDto {
  @ApiProperty({ example: 'Condition A', description: 'Tên condition' })
  name: string;
}

@ApiTags('conditions')
@Controller('conditions')
export class ConditionController {
  constructor(private readonly conditionService: ConditionService) {}

  @Get() 
  @ApiOperation({ summary: 'Lấy danh sách condition' })
  @ApiResponse({ status: 200, description: 'Danh sách condition.' })
  async findAll() {
    return this.conditionService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Tạo condition mới' })
  @ApiBody({ type: CreateConditionDto })
  @ApiResponse({ status: 201, description: 'Condition đã được tạo.' })
  async create(@Body() createConditionDto: CreateConditionDto) {
    return this.conditionService.create(createConditionDto.name);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá condition theo id' })
  @ApiParam({ name: 'id', description: 'ID của condition' })
  @ApiResponse({ status: 200, description: 'Condition đã bị xoá.' })
  async delete(@Param('id') id: string) {
    return this.conditionService.deleteById(id);
  }
}
