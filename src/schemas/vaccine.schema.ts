import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VaccineDocument = Vaccine & Document;
@Schema({ versionKey: false })
export class Vaccine extends Document {
  @Prop({ trim: true, required: true })
  name: string;

  @Prop({ required: true })
  dosage: string;
}

export const VaccineSchema = SchemaFactory.createForClass(Vaccine);
