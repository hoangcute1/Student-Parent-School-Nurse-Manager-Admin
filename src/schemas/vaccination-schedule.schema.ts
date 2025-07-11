import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type VaccinationScheduleDocument = VaccinationSchedule & Document;

export enum VaccinationStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

@Schema({ timestamps: true })
export class VaccinationSchedule extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true })
  vaccination_date: Date;

  @Prop({ required: true, trim: true })
  vaccination_time: string;

  @Prop({ trim: true })
  location?: string;

  @Prop({ trim: true })
  doctor_name?: string;

  @Prop({ trim: true })
  vaccine_type?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Student', required: true })
  student_id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Staff' })
  created_by: MongooseSchema.Types.ObjectId;

  @Prop({ enum: VaccinationStatus, default: VaccinationStatus.PENDING })
  status: string;

  @Prop({ type: Number })
  grade_level?: number;

  @Prop({ trim: true })
  parent_response_notes?: string;

  @Prop({ trim: true })
  rejection_reason?: string;

  @Prop({ trim: true })
  vaccination_result?: string;

  @Prop({ trim: true })
  vaccination_notes?: string;

  @Prop({ trim: true })
  recommendations?: string;

  @Prop({ type: Boolean, default: false })
  follow_up_required?: boolean;

  @Prop({ type: Date })
  follow_up_date?: Date;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const VaccinationScheduleSchema = SchemaFactory.createForClass(VaccinationSchedule);
