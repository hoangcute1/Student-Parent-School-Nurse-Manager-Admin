import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicineDeliveryController } from '@/controllers/medicine-delivery.controller';
import { MedicineDeliveryService } from '@/services/medicine-delivery.service';
import {
  MedicineDelivery,
  MedicineDeliverySchema,
} from '@/schemas/medicine-delivery.schema';
import { ParentModule } from './parent.module';
import { Staff } from '@/schemas/staff.schema';
import { StaffModule } from './staff.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MedicineDelivery.name, schema: MedicineDeliverySchema },
    ]),
    ParentModule,
    StaffModule,
    UserModule
  ],
  controllers: [MedicineDeliveryController],
  providers: [MedicineDeliveryService],
  exports: [MedicineDeliveryService],
})
export class MedicineDeliveryModule {}
