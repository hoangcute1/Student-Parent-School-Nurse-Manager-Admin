import { CampaignStatus } from '@/enums/campaign.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PeriodicCampaignDocument = PeriodicCampaign & Document;

@Schema({ timestamps: true })
export class PeriodicCampaign extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Doctor', required: true })
  doctor: MongooseSchema.Types.ObjectId;

  @Prop({ trim: true, required: true })
  name: string;

  @Prop({ required: true, trim: true })
  place: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ enum: CampaignStatus, default: CampaignStatus.PENDING })
  status: string;

  @Prop({ required: true, trim: true })
  notes: string;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const PeriodicCampaignSchema = SchemaFactory.createForClass(PeriodicCampaign);
