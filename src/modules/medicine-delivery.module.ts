import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicineDeliveryController } from '@/controllers/medicine-delivery.controller';
import { MedicineDeliveryService } from '@/services/medicine-delivery.service';
import {
  MedicineDelivery,
  MedicineDeliverySchema,
} from '@/schemas/medicine-delivery.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MedicineDelivery.name, schema: MedicineDeliverySchema },
    ]),
  ],
  controllers: [MedicineDeliveryController],
  providers: [MedicineDeliveryService],
  exports: [MedicineDeliveryService],
})
export class MedicineDeliveryModule {}
