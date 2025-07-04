import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackResponseService } from '@/services/feedback-response.service';
import { FeedbackNotificationService } from '@/services/feedback-notification.service';
import { FeedbackResponseController } from '@/controllers/feedback-response.controller';
import { FeedbackNotificationController } from '@/controllers/feedback-notification.controller';
import { FeedbackResponse, FeedbackResponseSchema } from '@/schemas/feedback-response.schema';
import {
  FeedbackNotification,
  FeedbackNotificationSchema,
} from '@/schemas/feedback-notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FeedbackResponse.name, schema: FeedbackResponseSchema },
      { name: FeedbackNotification.name, schema: FeedbackNotificationSchema },
    ]),
  ],
  controllers: [FeedbackResponseController, FeedbackNotificationController],
  providers: [FeedbackResponseService, FeedbackNotificationService],
  exports: [FeedbackResponseService, FeedbackNotificationService],
})
export class FeedbackEnhancedModule {}
