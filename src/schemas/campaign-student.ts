import { StudentCampaignStatus } from '@/enums/campaign.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CampaignStudentDocument = CampaignStudent & Document;

@Schema({ timestamps: true })
export class CampaignStudent extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'ClassCampaign',
    required: true,
  })
  class_campaign: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Student', required: true })
  student: MongooseSchema.Types.ObjectId;

  @Prop({ enum: StudentCampaignStatus, default: false })
  status: string;

  @Prop({ default: Date.now })
  date: Date;
}

export const CampaignStudentSchema =
  SchemaFactory.createForClass(CampaignStudent);
