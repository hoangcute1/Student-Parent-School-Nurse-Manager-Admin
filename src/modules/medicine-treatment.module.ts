import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MedicineTreatment,
  MedicineTreatmentSchema,
} from '@/schemas/medicine-treatment.schema';
import { MedicineTreatmentService } from '@/services/medicine-treatment.service';
import { MedicineTreatmentController } from '@/controllers/medicine-treatment.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MedicineTreatment.name, schema: MedicineTreatmentSchema },
    ]),
  ],
  controllers: [MedicineTreatmentController],
  providers: [MedicineTreatmentService],
  exports: [MedicineTreatmentService],
})
export class MedicineTreatmentModule {}
