import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user.module';
import { ConfigModule } from '@nestjs/config';

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
import { MedicineStorageModule } from './modules/medicine-storage.module';
import { MedicineDeliveryModule } from './modules/medicine-delivery.module';
import { FeedbackModule } from './modules/feedback.module';
import { SuggestionModule } from './modules/suggestion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRoot(configuration().MONGODB_URI),
    AuthModule,
    ThrottlerModule,
    TokenBlacklistModule,
    UserModule,
    ProfileModule,

    StudentModule,
    ParentModule,
    StaffModule,
    AdminModule,
    MedicineStorageModule,
    MedicineDeliveryModule,
    FeedbackModule,
    SuggestionModule,
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
