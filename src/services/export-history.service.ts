import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExportHistory } from '../schemas/export-history.schema';
import { CreateExportHistoryDto } from '../decorations/dto/create-export-history.dto';

@Injectable()
export class ExportHistoryService {
  constructor(
    @InjectModel(ExportHistory.name) private readonly exportHistoryModel: Model<ExportHistory>,
  ) {}

  async create(createExportHistoryDto: CreateExportHistoryDto): Promise<ExportHistory> {
    const createdExportHistory = new this.exportHistoryModel(createExportHistoryDto);
    return createdExportHistory.save();
  }

  async findAll(): Promise<ExportHistory[]> {
    return this.exportHistoryModel.find().populate('medicineId').exec();
  }
}
