import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema({ versionKey: false })
export class Profile extends Document {
  @Prop({ required: false, default: null })
  name: string;

  @Prop({
    enum: ['male', 'female', 'other'],
    required: false,
    default: 'other',
  })
  gender: string;

  @Prop({ required: false, default: null })
  birth: Date;

  @Prop({ required: false, default: null })
  address: string;

  @Prop({ required: false, default: null })
  avatar: string;

  @Prop({ required: false, default: null })
  phone: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: MongooseSchema.Types.ObjectId;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
