import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema({ versionKey: false })
export class Student extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  studentId: string;

  @Prop()
  birth: Date;

  @Prop({ enum: ['male', 'female', 'other'] })
  gender: string;

  @Prop()
  grade: string;

  @Prop()
  class: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Parent' })
  parentId: MongooseSchema.Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
