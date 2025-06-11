import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export type AdminDocument = Admin & Document;

@Schema({ versionKey: false })
export class Admin extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: MongooseSchema.Types.ObjectId;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
