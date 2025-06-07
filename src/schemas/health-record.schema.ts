import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Student } from './student.schema';

export type HealthRecordDocument = HealthRecord & Document;

@Schema({ timestamps: true })
export class HealthRecord {
  @Prop({ required: true })
  allergies: string;

  @Prop()
  chronic_conditions: string;

  @Prop()
  treatment_history: string;

  @Prop()
  vision: string;

  @Prop()
  notes: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Student', required: true })
  student_id: Student;
}

export const HealthRecordSchema = SchemaFactory.createForClass(HealthRecord);
