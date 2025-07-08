import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExportHistory, ExportHistorySchema } from '../schemas/export-history.schema';
import { ExportHistoryService } from '../services/export-history.service';
import { ExportHistoryController } from '../controllers/export-history.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: ExportHistory.name, schema: ExportHistorySchema }])],
  providers: [ExportHistoryService],
  controllers: [ExportHistoryController],
  exports: [ExportHistoryService],
})
export class ExportHistoryModule {}
