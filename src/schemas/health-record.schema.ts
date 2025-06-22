import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type HealthRecordDocument = HealthRecord & Document;

@Schema({ timestamps: true, versionKey: false })
export class HealthRecord {
  @Prop({ required: true, default: 'None' })
  allergies: string;

  @Prop({ required: false, default: 'None' })
  chronic_conditions: string;

  @Prop({ required: false })
  height: string;

  @Prop({ required: false })
  weight: string;

  @Prop({ required: false, default: 'Normal' })
  vision: string;

  @Prop({ required: false, default: 'Normal' })
  hearing: string;

  @Prop({ required: false })
  blood_type: string;

  @Prop({ required: false })
  treatment_history: string;

  @Prop({ required: false })
  notes: string;

  @Prop({ 
    type: MongooseSchema.Types.ObjectId, 
    ref: 'Student', 
    required: true,
    index: true
  })
  student_id: MongooseSchema.Types.ObjectId;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const HealthRecordSchema = SchemaFactory.createForClass(HealthRecord);
