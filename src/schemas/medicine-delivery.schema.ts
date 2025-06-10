import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Student } from './student.schema';

export type MedicineDeliveryDocument = MedicineDelivery & Document;

export enum MedicineDeliveryStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Schema({ timestamps: true })
export class MedicineDelivery extends Document {
  @Prop({ required: true })
  medicine_name: string;

  @Prop({ required: true })
  delivery_date: Date;

  @Prop({ required: true, min: 0 })
  total: number;

  @Prop({
    required: true,
    enum: MedicineDeliveryStatus,
    default: MedicineDeliveryStatus.PENDING
  })
  status: MedicineDeliveryStatus;

  @Prop({ required: true })
  perDose: string; // Ví dụ: "2 tablets"

  @Prop({ required: true })
  perDay: string; // Ví dụ: "3 times a day"

  @Prop({ trim: true })
  note?: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ required: true })
  sentAt: Date;

  @Prop({ required: true })
  endAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Student', required: true })
  student: Student;
}

export const MedicineDeliverySchema = SchemaFactory.createForClass(MedicineDelivery);
