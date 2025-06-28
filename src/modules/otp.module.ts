import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from '@/schemas/otp.schema';
import { OtpService } from '@/services/otp.service';
import { MailModule } from './mail.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]), MailModule],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
