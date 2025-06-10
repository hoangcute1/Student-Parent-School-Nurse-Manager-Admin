import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Parent } from './parent.schema';

export type FeedbackDocument = Feedback & Document;

@Schema({ timestamps: true })
export class Feedback extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Parent', required: true })
  parent: Parent;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ trim: true, default: null })
  response: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
