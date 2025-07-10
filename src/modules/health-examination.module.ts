import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthExamination, HealthExaminationSchema } from '@/schemas/health-examination.schema';
import { HealthExaminationService } from '@/services/health-examination.service';
import { HealthExaminationController } from '@/controllers/health-examination.controller';
import { NotificationModule } from './notification.module';
import { StudentModule } from './student.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HealthExamination.name, schema: HealthExaminationSchema }]),
    forwardRef(() => NotificationModule),
    StudentModule,
  ],
  controllers: [HealthExaminationController],
  providers: [HealthExaminationService],
  exports: [HealthExaminationService],
})
export class HealthExaminationModule {}
