import { Module } from '@nestjs/common';

import { AppService } from '../services/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import configuration from '../configuration';
import { ProfileModule } from './profile.module';
import { AuthModule } from './auth.module';
import { StudentModule } from './student.module';
import { ThrottlerModule } from './throttler.module';
import { TokenBlacklistModule } from './token-blacklist.module';
import { ParentModule } from './parent.module';
import { StaffModule } from './staff.module';
import { AdminModule } from './admin.module';
import { APP_GUARD } from '@nestjs/core';
import { AppThrottlerGuard } from '../guards/throttler.guard';
import { MedicineDeliveryModule } from './medicine-delivery.module';
import { FeedbackModule } from './feedback.module';
import { FeedbackEnhancedModule } from './feedback-enhanced.module';
import { SuggestionModule } from './suggestion.module';
import { CampaignClassModule } from './campaign-class.module';
import { CampaignStudentModule } from './campaign-student.module';
import { HealthRecordModule } from './health-record.module';
import { MedicineModule } from './medicine.module';
import { MedicineTreatmentModule } from './medicine-treatment.module';
import { NotificationModule } from './notification.module';
import { SimpleNotificationModule } from './simple-notification.module';
import { ParentStudentModule } from './parent-student.module';
import { PeriodicCampaignModule } from './periodic-campaign.module';
import { TreatmentHistoryModule } from './treatment-history.module';
import { VaccineModule } from './vaccine.module';
import { VaccineCampaignModule } from './vaccine-campaign.module';
import { ClassModule } from './class.module';
import { TokenModule } from './token.module';
import { ExportHistoryModule } from './export-history.module';
import { HealthExaminationModule } from './health-examination.module';
import { VaccinationScheduleModule } from './vaccination-schedule.module';
import { AppController } from '@/controllers/app.controller';
import { TestModule } from './test.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(configuration().MONGODB_URI),
    AuthModule,
    ThrottlerModule,
    TokenBlacklistModule,
    TokenModule,
    UserModule,
    ProfileModule,
    ClassModule,
    StudentModule,
    ParentModule,
    StaffModule,
    AdminModule,
    MedicineDeliveryModule,
    FeedbackModule,
    FeedbackEnhancedModule,
    SuggestionModule,
    CampaignClassModule,
    CampaignStudentModule,
    HealthRecordModule,
    HealthExaminationModule,
    MedicineModule,
    MedicineTreatmentModule,
    NotificationModule,
    SimpleNotificationModule,
    ParentStudentModule,
    PeriodicCampaignModule,
    TreatmentHistoryModule,
    VaccineModule,
    VaccineCampaignModule,
    VaccinationScheduleModule,
    ExportHistoryModule,
    TestModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AppThrottlerGuard,
    },
  ],
})
export class AppModule {}
