import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user.module';
import { ConfigModule } from '@nestjs/config';
import { ConditionModule } from './modules/condition.module';
import configuration from './configuration';
import { ProfileModule } from './modules/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRoot(configuration().mongodbUri),
    UserModule,
    ConditionModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
