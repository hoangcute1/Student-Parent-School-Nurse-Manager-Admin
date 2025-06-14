import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from '@/services/admin.service';
import { Admin, AdminSchema } from '@/schemas/admin.schema';
import { AdminController } from '@/controllers/admin.controller';
import { UserModule } from './user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    forwardRef(() => UserModule),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
