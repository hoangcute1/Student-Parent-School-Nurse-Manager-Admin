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

  @Prop({ default: Date.now })
  created_at: Date;
}

export const SuggestionSchema = SchemaFactory.createForClass(Suggestion);
