import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Role } from './role.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  userId: string;


  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refresh_token: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role' })
  roleId: Role;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
