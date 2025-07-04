import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackController } from '@/controllers/feedback.controller';
import { TestController } from '@/controllers/test.controller';
import { FeedbackService } from '@/services/feedback.service';
import { Feedback, FeedbackSchema } from '@/schemas/feedback.schema';
import { User, UserSchema } from '@/schemas/user.schema';
import { FeedbackEnhancedModule } from './feedback-enhanced.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Feedback.name, schema: FeedbackSchema },
      { name: User.name, schema: UserSchema },
    ]),
    forwardRef(() => FeedbackEnhancedModule),
  ],
  controllers: [FeedbackController, TestController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
