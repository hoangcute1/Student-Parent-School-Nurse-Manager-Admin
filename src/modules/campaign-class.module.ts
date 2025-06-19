import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignClassController } from '@/controllers/campaign-class.controller';
import { CampaignClassService } from '@/services/campaign-class.service';
import {
  CampaignClass,
  CampaignClassSchema,
} from '@/schemas/campaign-class.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CampaignClass.name, schema: CampaignClassSchema },
    ]),
  ],
  controllers: [CampaignClassController],
  providers: [CampaignClassService],
  exports: [CampaignClassService],
})
export class CampaignClassModule {}
