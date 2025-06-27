import { CampaignType } from '@/enums/campaign.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CampaignClassDocument = CampaignClass & Document;

@Schema({ timestamps: true })
export class CampaignClass extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    refPath: 'campaign_type',
    required: true,
  })
  campaign: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: CampaignType,
  })
  campaign_type: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Class', required: true })
  class: MongooseSchema.Types.ObjectId;
}

export const CampaignClassSchema = SchemaFactory.createForClass(CampaignClass);
