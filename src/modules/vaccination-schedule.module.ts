import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  VaccinationSchedule,
  VaccinationScheduleSchema,
} from '@/schemas/vaccination-schedule.schema';
import { VaccinationScheduleService } from '@/services/vaccination-schedule.service';
import { VaccinationScheduleController } from '@/controllers/vaccination-schedule.controller';
import { NotificationModule } from './notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VaccinationSchedule.name, schema: VaccinationScheduleSchema },
    ]),
    forwardRef(() => NotificationModule),
  ],
  controllers: [VaccinationScheduleController],
  providers: [VaccinationScheduleService],
  exports: [VaccinationScheduleService],
})
export class VaccinationScheduleModule {}
