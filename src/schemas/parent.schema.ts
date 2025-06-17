import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ParentDocument = Parent & Document;

@Schema({ versionKey: false })
export class Parent extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: false })
  name: string;

  @Prop({ required: false })
  phone: string;

  @Prop({ required: false })
  address: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ParentSchema = SchemaFactory.createForClass(Parent);
