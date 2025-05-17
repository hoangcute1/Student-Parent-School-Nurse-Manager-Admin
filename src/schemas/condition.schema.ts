import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class Condition extends Document {
  @Prop({ required: true })
  name: string;
}

export const ConditionSchema = SchemaFactory.createForClass(Condition);
