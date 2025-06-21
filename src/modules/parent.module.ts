import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParentController } from '@/controllers/parent.controller';
import { ParentService } from '@/services/parent.service';
import { Parent, ParentSchema } from '@/schemas/parent.schema';
import { UserModule } from './user.module';
import { ProfileModule } from './profile.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Parent.name, schema: ParentSchema }]),
    forwardRef(() => UserModule),
    ProfileModule,
  ],
  controllers: [ParentController],
  providers: [ParentService],
  exports: [ParentService],
})
export class ParentModule {}
