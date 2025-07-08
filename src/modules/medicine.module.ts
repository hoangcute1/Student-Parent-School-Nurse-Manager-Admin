// Trong medicine.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Medicine, MedicineSchema } from '../schemas/medicine.schema';
import { MedicineService } from '../services/medicine.service';
import { MedicineController } from '../controllers/medicine.controller';
import { ExportHistoryModule } from './export-history.module'; // Import ExportHistoryModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Medicine.name, schema: MedicineSchema }]),
    ExportHistoryModule, // Add ExportHistoryModule to imports
  ],
  providers: [MedicineService],
  controllers: [MedicineController],
  exports: [MedicineService],
})
export class MedicineModule {}
