import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestController } from '@/controllers/test.controller';
import { FeedbackModule } from './feedback.module';
import { FeedbackEnhancedModule } from './feedback-enhanced.module';
import { HealthExaminationModule } from './health-examination.module';
import { StudentModule } from './student.module';

@Module({
  imports: [
    forwardRef(() => FeedbackModule),
    forwardRef(() => FeedbackEnhancedModule),
    forwardRef(() => HealthExaminationModule),
    forwardRef(() => StudentModule),
  ],
  controllers: [TestController],
  exports: [],
})
export class TestModule {}
