import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class ExportHistory extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Medicine', required: true })
  medicineId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  reason: string;

  @Prop({ required: true })
  medicalStaffName: string;

  @Prop({ required: true })
  exportDate: Date;
}

export const ExportHistorySchema = SchemaFactory.createForClass(ExportHistory);
