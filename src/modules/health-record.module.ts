import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HealthRecord,
  HealthRecordSchema,
} from '@/schemas/health-record.schema';
import { HealthRecordService } from '@/services/health-record.service';
import { HealthRecordController } from '@/controllers/health-record.controller';
import { StudentModule } from './student.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HealthRecord.name, schema: HealthRecordSchema },
    ]),
    forwardRef(() => StudentModule),
  ],
  controllers: [HealthRecordController],
  providers: [HealthRecordService],
  exports: [HealthRecordService],
})
export class HealthRecordModule {}
