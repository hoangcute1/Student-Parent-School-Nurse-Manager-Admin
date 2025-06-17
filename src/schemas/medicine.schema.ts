import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
export type MedicineDocument = Medicine & Document;

@Schema()
export class Medicine extends Document {
  @Prop({ trim: true, required: true })
  name: string;

  @Prop({ required: true })
  dosage: string;

  @Prop({ trim: true, required: true })
  description: string;
}

export const MedicineSchema = SchemaFactory.createForClass(Medicine);
