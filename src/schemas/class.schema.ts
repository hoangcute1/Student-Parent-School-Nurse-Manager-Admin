import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClassDocument = Class & Document;
@Schema({ versionKey: false })
export class Class extends Document {
  @Prop({ trim: true, unique: true, required: true })
  name: string;

  @Prop({ required: true })
  grade: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const ClassSchema = SchemaFactory.createForClass(Class);
