import { Module } from '@nestjs/common';
import { UserInfoController } from '@/controllers/user-info.controller';

@Module({
  controllers: [UserInfoController],
})
export class UserInfoModule {}
