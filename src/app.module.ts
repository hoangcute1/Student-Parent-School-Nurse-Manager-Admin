import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import configuration from './configuration';
import { ProfileModule } from './modules/profile.module';
import { AuthModule } from './modules/auth.module';
import { StudentModule } from './modules/student.module';
import { ThrottlerModule } from './modules/throttler.module';
import { TokenBlacklistModule } from './modules/token-blacklist.module';
import { ParentModule } from './modules/parent.module';
import { StaffModule } from './modules/staff.module';
import { AdminModule } from './modules/admin.module';
import { APP_GUARD } from '@nestjs/core';
import { AppThrottlerGuard } from './guards/throttler.guard';
import { MedicineDeliveryModule } from './modules/medicine-delivery.module';
import { FeedbackModule } from './modules/feedback.module';
import { FeedbackEnhancedModule } from './modules/feedback-enhanced.module';
import { SuggestionModule } from './modules/suggestion.module';
import { CampaignClassModule } from './modules/campaign-class.module';
import { CampaignStudentModule } from './modules/campaign-student.module';
import { HealthRecordModule } from './modules/health-record.module';
import { MedicineModule } from './modules/medicine.module';
import { MedicineTreatmentModule } from './modules/medicine-treatment.module';
import { NotificationModule } from './modules/notification.module';
import { ParentStudentModule } from './modules/parent-student.module';
import { PeriodicCampaignModule } from './modules/periodic-campaign.module';
import { TreatmentHistoryModule } from './modules/treatment-history.module';
import { VaccineModule } from './modules/vaccine.module';
import { VaccineCampaignModule } from './modules/vaccine-campaign.module';
import { ClassModule } from './modules/class.module';
import { TokenModule } from './modules/token.module';

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
    MedicineModule,
    MedicineTreatmentModule,
    NotificationModule,
    ParentStudentModule,
    PeriodicCampaignModule,
    TreatmentHistoryModule,
    VaccineModule,
    VaccineCampaignModule,
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
