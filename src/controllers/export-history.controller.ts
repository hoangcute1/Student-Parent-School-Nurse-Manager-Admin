import { Controller, Get, Post, Body } from '@nestjs/common';
import { ExportHistoryService } from '../services/export-history.service';
import { CreateExportHistoryDto } from '../decorations/dto/create-export-history.dto';

@Controller('export-history')
export class ExportHistoryController {
  constructor(private readonly exportHistoryService: ExportHistoryService) {}

  @Post()
  async create(@Body() createExportHistoryDto: CreateExportHistoryDto) {
    return this.exportHistoryService.create(createExportHistoryDto);
  }

  @Get()
  async findAll() {
    return this.exportHistoryService.findAll();
  }
}
