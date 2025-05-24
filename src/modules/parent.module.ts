import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParentController } from '@/controllers/parent.controller';
import { ParentService } from '@/services/parent.service';
import { Parent, ParentSchema } from '@/schemas/parent.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Parent.name, schema: ParentSchema }]),
  ],
  controllers: [ParentController],
  providers: [ParentService],
  exports: [ParentService],
})
export class ParentModule {}
