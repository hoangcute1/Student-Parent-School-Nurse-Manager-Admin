import { DoctorPosition } from '@/enums/doctor.enum';
import { Gender } from '@/enums/gender.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DoctorDocument = Doctor & Document;

@Schema({ versionKey: false })
export class Doctor extends Document {
  @Prop({ unique: true, required: true })
  name: string;
  @Prop({ enum: DoctorPosition, default: DoctorPosition.OTHER })
  position: string;
  @Prop({ enum: Gender, default: Gender.OTHER })
  gender: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
