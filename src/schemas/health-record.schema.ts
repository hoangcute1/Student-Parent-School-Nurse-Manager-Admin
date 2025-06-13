import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema} from 'mongoose';

export type HealthRecordDocument = HealthRecord & Document;

@Schema({ timestamps: true, versionKey: false })
export class HealthRecord {
  @Prop({ required: true })
  allergies: string;

  @Prop({ required: false }) 
  chronic_conditions: string;

  @Prop({ required: false })
  height: string;

  @Prop({ required: false })
  weight: string;

  @Prop({ required: false })
  vision: string;

  @Prop({ required: false })
  hearing: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Student', required: true })
  student: MongooseSchema.Types.ObjectId;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const HealthRecordSchema = SchemaFactory.createForClass(HealthRecord);
