import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class Student extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  studentId: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
