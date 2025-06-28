import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/schemas/user.schema';
import { UserService } from '@/services/user.service';
import { UserController } from '@/controllers/user.controller';

import { ProfileModule } from './profile.module';
import { AdminModule } from './admin.module';
import { StaffModule } from './staff.module';
import { ParentModule } from './parent.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ProfileModule,
    AdminModule,
    forwardRef(() => StaffModule),
    forwardRef(() => ParentModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
