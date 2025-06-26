import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MedicineDocument = Medicine & Document;

export enum MedicineUnit {
  TABLET = 'tablet',
  CAPSULE = 'capsule',
  LIQUID = 'liquid',
  INJECTION = 'injection',
  CREAM = 'cream',
  DROPS = 'drops',
  INHALER = 'inhaler',
  OTHER = 'other',
}

export enum MedicineType {
  ANALGESIC = 'analgesic',
  ANTIBIOTIC = 'antibiotic',
  ANTIHISTAMINE = 'antihistamine',
  ANTIVIRAL = 'antiviral',
  ANTIHYPERTENSIVE = 'antihypertensive',
  ANTIDEPRESSANT = 'antidepressant',
  ANTIINFLAMMATORY = 'anti-inflammatory',
  ANTIFUNGAL = 'antifungal',
  ANTISEPTIC = 'antiseptic',
  VITAMIN = 'vitamin',
  OTHER = 'other',
}

@Schema({ timestamps: true, versionKey: false })
export class Medicine extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  dosage: string;

   @Prop({ required: true, trim: true })
    quantity: number;

  @Prop({ required: true, enum: MedicineUnit, default: MedicineUnit.OTHER })
  unit: MedicineUnit;

  @Prop({ required: true, enum: MedicineType, default: MedicineType.OTHER })
  type: MedicineType;

  @Prop({ required: false, default: null })
  usage_instructions: string;

  @Prop({ required: false, default: null })
  side_effects: string;

  @Prop({ required: false, default: null })
  contraindications: string;

  @Prop({ trim: true, required: true })
  description: string;

  @Prop({ required: false, default: null })
  image: string;

  @Prop({ required: false, default: false })
  is_prescription_required: boolean;

  @Prop({ required: false, default: null })
  manufacturer: string;
}

export const MedicineSchema = SchemaFactory.createForClass(Medicine);
