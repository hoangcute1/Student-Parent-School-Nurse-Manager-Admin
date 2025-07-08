import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestController } from '@/controllers/test.controller';
import { FeedbackModule } from './feedback.module';
import { FeedbackEnhancedModule } from './feedback-enhanced.module';

@Module({
  imports: [forwardRef(() => FeedbackModule), forwardRef(() => FeedbackEnhancedModule)],
  controllers: [TestController],
  exports: [],
})
export class TestModule {}
