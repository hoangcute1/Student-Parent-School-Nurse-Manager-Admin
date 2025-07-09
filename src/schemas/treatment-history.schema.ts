import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class TreatmentHistory extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Student', required: true })
  student: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Staff', required: true })
  staff: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'HealthRecord',
    required: true,
  })
  record: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ trim: true, required: true })
  description: string;

  @Prop({ trim: true, required: false })
  notes: string;

  // Additional fields from frontend
  @Prop({ trim: true, required: false })
  title: string;

  @Prop({ type: String, required: false })
  class: string;

  @Prop({ trim: true, required: false })
  location: string;

  @Prop({ trim: true, required: false })
  priority: string;

  @Prop({ trim: true, required: false })
  contactStatus: string;

  @Prop({
    type: String,
    enum: ['pending', 'processing', 'resolved'],
    default: 'pending',
  })
  status: string;

  @Prop({ required: false })
  contactParent: boolean;

  @Prop({ trim: true, required: false })
  actionTaken: string;
}

export const TreatmentHistorySchema = SchemaFactory.createForClass(TreatmentHistory);
