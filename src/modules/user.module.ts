import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/schemas/user.schema';
import { UserService } from '@/services/user.service';
import { UserController } from '@/controllers/user.controller';
import { RoleModule } from './role.module';
import { ProfileModule } from './profile.module';
import { AdminModule } from './admin.module';
import { StaffModule } from './staff.module';
import { ParentModule } from './parent.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RoleModule,
    ProfileModule,
    AdminModule,
    StaffModule,
    ParentModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
