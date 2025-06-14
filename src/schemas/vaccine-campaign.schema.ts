import { CampaignStatus } from '@/enums/campaign.enum';
import { FeedbackStatus } from '../enums/feedback.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type VaccineCampaignDocument = VaccineCampaign & Document;

@Schema({ timestamps: true })
export class VaccineCampaign extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vaccine', required: true })
  vaccine: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, trim: true })
  place: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ enum: CampaignStatus, default: CampaignStatus.PENDING })
  status: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Staff', required: true })
  staff: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, trim: true })
  notes: string;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const VaccineCampaignSchema =
  SchemaFactory.createForClass(VaccineCampaign);
