import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export type StaffDocument = Staff & Document;

@Schema({ versionKey: false })
export class Staff extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: MongooseSchema.Types.ObjectId;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);
