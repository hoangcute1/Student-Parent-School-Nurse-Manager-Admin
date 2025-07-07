import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MedicineDeliveryDocument = MedicineDelivery & Document;

export enum MedicineDeliveryStatus {
  PENDING = 'pending',
  PROGRESS = 'progress',
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

  @Prop({ required: true, default: Date.now })
  sent_at: Date;

  @Prop({ required: true })
  end_at: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Student', required: true })
  student: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Parent', required: true })
  parent: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Staff', required: true })
  staff: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Medicine',
    required: true,
  })
  medicine: MongooseSchema.Types.ObjectId;
  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  // Array of staff IDs who have hidden this delivery from their view
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Staff', default: [] })
  hiddenFromStaff: MongooseSchema.Types.ObjectId[];
}

export const MedicineDeliverySchema = SchemaFactory.createForClass(MedicineDelivery);
