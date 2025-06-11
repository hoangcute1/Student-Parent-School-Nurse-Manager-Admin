import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;
@Schema({ versionKey: false })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
  
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role', required: true })
  role: MongooseSchema.Types.ObjectId;

  @Prop({ default: null, type: String })
  refresh_token: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
