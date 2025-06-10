import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user.module';
import { ConfigModule } from '@nestjs/config';
import { ConditionModule } from './modules/condition.module';
import configuration from './configuration';
import { ProfileModule } from './modules/profile.module';
import { AuthModule } from './modules/auth.module';
import { StudentModule } from './modules/student.module';
import { RoleModule } from './modules/role.module';
import { ThrottlerModule } from './modules/throttler.module';
import { TokenBlacklistModule } from './modules/token-blacklist.module';
import { ParentModule } from './modules/parent.module';
import { StaffModule } from './modules/staff.module';
import { AdminModule } from './modules/admin.module';
import { APP_GUARD } from '@nestjs/core';
import { AppThrottlerGuard } from './guards/throttler.guard';
import { MedicineStorageModule } from './modules/medicine-storage.module';
import { MedicineDeliveryModule } from './modules/medicine-delivery.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRoot(configuration().MONGODB_URI),
    ThrottlerModule,
    TokenBlacklistModule,
    UserModule,
    ConditionModule,
    ProfileModule,
    AuthModule,
    StudentModule,
    RoleModule,
    ParentModule,
    StaffModule,
    AdminModule,
    MedicineStorageModule,
    MedicineDeliveryModule,
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
