import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Condition, ConditionSchema } from '../schemas/condition.schema';
import { ConditionService } from '../services/condition.service';
import { ConditionController } from '../controllers/condition.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Condition.name, schema: ConditionSchema }])],
  controllers: [ConditionController],
  providers: [ConditionService],
  exports: [ConditionService],
})
export class ConditionModule {}
