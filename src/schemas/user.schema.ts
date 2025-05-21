import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Role } from './role.schema';

export type UserDocument = User & Document;
@Schema({ versionKey: false })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  // Remove the direct role field and only use roleId reference
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role', required: true })
  roleId: MongooseSchema.Types.ObjectId;

  @Prop({ default: null, type: String })
  refreshToken: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
