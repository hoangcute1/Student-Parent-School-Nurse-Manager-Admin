import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MedicineTreatmentDocument = MedicineTreatment & Document;
@Schema({ versionKey: false })
export class MedicineTreatment extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'TreatmentHistory',
    required: true,
  })
  treatment: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'MedicineStorage',
    required: false,
    default: null,
  })
  medicine?: MongooseSchema.Types.ObjectId;
}

export const MedicineTreatmentSchema =
  SchemaFactory.createForClass(MedicineTreatment);
