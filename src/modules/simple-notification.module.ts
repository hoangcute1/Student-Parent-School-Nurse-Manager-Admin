import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SimpleNotificationController } from '@/controllers/simple-notification.controller';
import { SimpleNotificationService } from '@/services/simple-notification.service';
import { SimpleNotification, SimpleNotificationSchema } from '@/schemas/simple-notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SimpleNotification.name, schema: SimpleNotificationSchema },
    ]),
  ],
  controllers: [SimpleNotificationController],
  providers: [SimpleNotificationService],
  exports: [SimpleNotificationService],
})
export class SimpleNotificationModule {}
