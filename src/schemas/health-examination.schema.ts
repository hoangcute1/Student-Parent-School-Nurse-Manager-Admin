import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum ExaminationStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export enum ExaminationType {
  PERIODIC_HEALTH = 'Khám sức khỏe định kỳ',
  DENTAL = 'Khám răng miệng',
  EYE = 'Khám mắt',
}

export type HealthExaminationDocument = HealthExamination & Document;

@Schema({ timestamps: true, versionKey: false })
export class HealthExamination {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  examination_date: Date;

  @Prop({ required: true })
  examination_time: string;

  @Prop({ required: false })
  location: string;

  @Prop({ required: false })
  doctor_name: string;

  @Prop({
    required: false,
    enum: Object.values(ExaminationType),
    default: ExaminationType.PERIODIC_HEALTH,
  })
  examination_type: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Student',
    required: true,
  })
  student_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: false })
  grade_level: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Staff',
    required: true,
  })
  created_by: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    enum: ExaminationStatus,
    default: ExaminationStatus.PENDING,
  })
  status: string;

  @Prop({ required: false })
  parent_response_notes: string;

  @Prop({ required: false })
  rejection_reason: string;

  // Health examination results
  @Prop({ required: false })
  health_result: string;

  @Prop({ required: false })
  examination_notes: string;

  @Prop({ required: false })
  recommendations: string;

  @Prop({ default: false })
  follow_up_required: boolean;

  @Prop({ required: false })
  follow_up_date: Date;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const HealthExaminationSchema = SchemaFactory.createForClass(HealthExamination);
