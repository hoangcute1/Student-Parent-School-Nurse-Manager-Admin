import { MedicineStorageController } from '@/controllers/medicine-storage.controller';
import {
  MedicineStorage,
  MedicineStorageSchema,
} from '@/schemas/medicine-storage.schema';
import { MedicineStorageService } from '@/services/medicine-storage.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MedicineStorage.name, schema: MedicineStorageSchema },
    ]),
  ],
  controllers: [MedicineStorageController],
  providers: [MedicineStorageService],
  exports: [MedicineStorageService],
})
export class MedicineStorageModule {}
