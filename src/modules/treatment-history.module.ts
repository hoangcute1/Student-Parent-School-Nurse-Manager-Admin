import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TreatmentHistory, TreatmentHistorySchema } from '@/schemas/treatment-history.schema';
import { TreatmentHistoryService } from '@/services/treatment-history.service';
import { TreatmentHistoryController } from '@/controllers/treatment-history.controller';
import { Student, StudentSchema } from '@/schemas/student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TreatmentHistory.name, schema: TreatmentHistorySchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  controllers: [TreatmentHistoryController],
  providers: [TreatmentHistoryService],
  exports: [TreatmentHistoryService],
})
export class TreatmentHistoryModule {}
