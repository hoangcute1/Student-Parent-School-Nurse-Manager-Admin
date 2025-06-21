import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffController } from '@/controllers/staff.controller';
import { StaffService } from '@/services/staff.service';
import { Staff, StaffSchema } from '@/schemas/staff.schema';
import { UserModule } from './user.module';
import { ProfileModule } from './profile.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Staff.name, schema: StaffSchema }]),
    forwardRef(() => UserModule),
    ProfileModule,
  ],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService],
})
export class StaffModule {}
