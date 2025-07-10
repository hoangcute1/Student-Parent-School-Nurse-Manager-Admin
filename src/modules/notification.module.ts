import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from '@/schemas/notification.schema';
import { NotificationService } from '@/services/notification.service';
import { NotificationController } from '@/controllers/notification.controller';
import { PeriodicCampaignSchema } from '@/schemas/periodic-campaign.schema';
import { VaccineCampaignSchema } from '@/schemas/vaccine-campaign.schema';
import { StudentModule } from './student.module';
import { HealthExaminationModule } from './health-examination.module';
import { ParentModule } from './parent.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: 'VaccineCampaign', schema: VaccineCampaignSchema },
      { name: 'PeriodicCampaign', schema: PeriodicCampaignSchema },
    ]),
    StudentModule,
    ParentModule,
    forwardRef(() => HealthExaminationModule),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
