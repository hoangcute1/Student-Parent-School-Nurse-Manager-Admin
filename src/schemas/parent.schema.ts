import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ParentDocument = Parent & Document;

@Schema({ versionKey: false })
export class Parent extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: MongooseSchema.Types.ObjectId;
}

export const ParentSchema = SchemaFactory.createForClass(Parent);
