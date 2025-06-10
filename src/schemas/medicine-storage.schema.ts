import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MedicineStorageDocument = MedicineStorage & Document;

export enum MedicineStatus {
  AVAILABLE = 'available',
  LOW = 'low',
  OUT_OF_STOCK = 'out_of_stock',
}

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

@Schema({ timestamps: true })
export class MedicineStorage extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, enum: MedicineUnit, default: MedicineUnit.OTHER })
  unit: MedicineUnit;

  @Prop({ required: true, min: 0 })
  amountLeft: number;

  @Prop({ required: true, min: 0 })
  total: number;

  @Prop({ required: true, enum: MedicineType, default: MedicineType.OTHER })
  type: string;

  @Prop({
    required: true,
    enum: MedicineStatus,
    default: MedicineStatus.AVAILABLE,
  })
  status: MedicineStatus;

  @Prop({ required: true })
  expired: Date;

  @Prop({ trim: true })
  description?: string;

  @Prop({ trim: true })
  image?: string;
}

export const MedicineStorageSchema =
  SchemaFactory.createForClass(MedicineStorage);
