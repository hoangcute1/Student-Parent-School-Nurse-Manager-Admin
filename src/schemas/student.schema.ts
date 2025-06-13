import { Gender } from '@/enums/gender.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema({ versionKey: false })
export class Student extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  birth: Date;

  @Prop({ enum: Gender, default: Gender.OTHER })
  gender: string;


  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Class' })
  class: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Parent' })
  parent: MongooseSchema.Types.ObjectId;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
