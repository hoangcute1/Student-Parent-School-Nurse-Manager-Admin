import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class Profile extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  address: string;

  @Prop()
  age: number;

  @Prop()
  email: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
