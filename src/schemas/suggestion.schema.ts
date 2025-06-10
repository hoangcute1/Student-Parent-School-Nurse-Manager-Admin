import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Parent } from './parent.schema';

export type SuggestionDocument = Suggestion & Document;

@Schema({ timestamps: true, versionKey: false })
export class Suggestion extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Parent', required: true })
  parent: Parent;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;
}

export const SuggestionSchema = SchemaFactory.createForClass(Suggestion);
