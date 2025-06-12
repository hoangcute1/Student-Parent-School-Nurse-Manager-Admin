import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MedicineDeliveryDocument = MedicineDelivery & Document;

export enum MedicineDeliveryStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true, versionKey: false })
export class MedicineDelivery extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, min: 0 })
  total: number;

  @Prop({
    required: true,
    enum: MedicineDeliveryStatus,
    default: MedicineDeliveryStatus.PENDING,
  })
  status: MedicineDeliveryStatus;

  @Prop({ required: true })
  per_dose: string; // Ví dụ: "2 tablets"

  @Prop({ required: true })
  per_day: string; // Ví dụ: "3 times a day"

  @Prop({ trim: true, required: false, default: null })
  note: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ required: true })
  sent_at: Date;

  @Prop({ required: true })
  end_at: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Student', required: true })
  student: MongooseSchema.Types.ObjectId;
}

export const MedicineDeliverySchema =
  SchemaFactory.createForClass(MedicineDelivery);
