import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TreatmentHistory, TreatmentHistorySchema } from '@/schemas/treatment-history.schema';
import { TreatmentHistoryService } from '@/services/treatment-history.service';
import { TreatmentHistoryController } from '@/controllers/treatment-history.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TreatmentHistory.name, schema: TreatmentHistorySchema },
    ]),
  ],
  controllers: [TreatmentHistoryController],
  providers: [TreatmentHistoryService],
  exports: [TreatmentHistoryService],
})
export class TreatmentHistoryModule {}
