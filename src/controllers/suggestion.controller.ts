import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SuggestionService } from '@/services/suggestion.service';
import {
  CreateSuggestionDto,
  UpdateSuggestionDto,
} from '@/decorations/dto/suggestion.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';

@ApiTags('suggestions')
@Controller('suggestions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SuggestionController {
  constructor(private readonly suggestionService: SuggestionService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo góp ý mới' })
  @ApiResponse({
    status: 201,
    description: 'Góp ý đã được tạo thành công.',
  })
  create(@Body() createSuggestionDto: CreateSuggestionDto) {
    return this.suggestionService.create(createSuggestionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách góp ý' })
  async findAll() {
    return this.suggestionService.findAll();
  }

  @Get('parent/:id')
  @ApiOperation({ summary: 'Lấy danh sách góp ý của một phụ huynh' })
  findByParent(@Param('id') id: string) {
    return this.suggestionService.findByParent(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một góp ý' })
  findOne(@Param('id') id: string) {
    return this.suggestionService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật góp ý' })
  update(
    @Param('id') id: string,
    @Body() updateSuggestionDto: UpdateSuggestionDto,
  ) {
    return this.suggestionService.update(id, updateSuggestionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa góp ý' })
  remove(@Param('id') id: string) {
    return this.suggestionService.remove(id);
  }
}
