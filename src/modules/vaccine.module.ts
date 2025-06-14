import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Vaccine, VaccineSchema } from '@/schemas/vaccine.schema';
import { VaccineService } from '@/services/vaccine.service';
import { VaccineController } from '@/controllers/vaccine.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vaccine.name, schema: VaccineSchema },
    ]),
  ],
  controllers: [VaccineController],
  providers: [VaccineService],
  exports: [VaccineService],
})
export class VaccineModule {}
