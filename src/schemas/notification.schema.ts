import { CampaignType } from '@/enums/campaign.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum NotificationType {
  VACCINE = 'VaccineCampaign',
  PERIODIC = 'PeriodicCampaign',
  HEALTH_EXAMINATION = 'HealthExamination',
}

export enum NotificationStatus {
  AGREE = 'Agree',
  DISAGREE = 'Disagree',
}

export type NotificationDocument = Notification & Document;
@Schema({ versionKey: false })
export class Notification extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    refPath: 'campaign_type', // Sử dụng refPath thay vì ref
    required: true,
  })
  noti_campaign: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: CampaignType, // Chỉ định rõ các model có thể tham chiếu
  })
  campaign_type: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Parent', required: true })
  parent: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Student', required: true })
  student: MongooseSchema.Types.ObjectId;

  @Prop({ trim: true, required: true })
  content: string;

  @Prop({ trim: true, required: true })
  notes: string;
  @Prop({ default: Date.now })
  date: Date;

  @Prop({
    type: String,
    required: true,
    enum: NotificationStatus,
  })
  confirmation_status: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
