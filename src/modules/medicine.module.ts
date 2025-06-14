import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Medicine, MedicineSchema } from '@/schemas/medicine.schema';
import { MedicineService } from '@/services/medicine.service';
import { MedicineController } from '@/controllers/medicine.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Medicine.name, schema: MedicineSchema },
    ]),
  ],
  controllers: [MedicineController],
  providers: [MedicineService],
  exports: [MedicineService],
})
export class MedicineModule {}
