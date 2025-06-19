import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignStudentController } from '@/controllers/campaign-student.controller';
import { CampaignStudentService } from '@/services/campaign-student.service';
import {
  CampaignStudent,
  CampaignStudentSchema,
} from '@/schemas/campaign-student';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CampaignStudent.name, schema: CampaignStudentSchema },
    ]),
  ],
  controllers: [CampaignStudentController],
  providers: [CampaignStudentService],
  exports: [CampaignStudentService],
})
export class CampaignStudentModule {}
