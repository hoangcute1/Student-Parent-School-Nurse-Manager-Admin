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
    ProfileModule,
    forwardRef(() => UserModule), // Ensure UserModule is imported after StaffService to avoid circular dependency
  ],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService],
})
export class StaffModule {}
