import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PeriodicCampaign,
  PeriodicCampaignSchema,
} from '@/schemas/periodic-campaign.schema';
import { PeriodicCampaignService } from '@/services/periodic-campaign.service';
import { PeriodicCampaignController } from '@/controllers/periodic-campaign.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PeriodicCampaign.name, schema: PeriodicCampaignSchema },
    ]),
  ],
  controllers: [PeriodicCampaignController],
  providers: [PeriodicCampaignService],
  exports: [PeriodicCampaignService],
})
export class PeriodicCampaignModule {}
