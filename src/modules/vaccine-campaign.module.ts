import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  VaccineCampaign,
  VaccineCampaignSchema,
} from '@/schemas/vaccine-campaign.schema';
import { VaccineCampaignService } from '@/services/vaccine-campaign.service';
import { VaccineCampaignController } from '@/controllers/vaccine-campaign.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VaccineCampaign.name, schema: VaccineCampaignSchema },
    ]),
  ],
  controllers: [VaccineCampaignController],
  providers: [VaccineCampaignService],
  exports: [VaccineCampaignService],
})
export class VaccineCampaignModule {}
