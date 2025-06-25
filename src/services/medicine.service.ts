import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medicine, MedicineDocument } from '../schemas/medicine.schema';

@Injectable()
export class MedicineService {
  constructor(
    @InjectModel(Medicine.name) private medicineModel: Model<MedicineDocument>,
  ) {}

  async create(data: Partial<Medicine>): Promise<Medicine> {
    const created = new this.medicineModel(data);
    return created.save();
  }

  async findAll(): Promise<Medicine[]> {
    return this.medicineModel.find().exec();
  }

  async findOne(id: string): Promise<Medicine> {
    const medicine = await this.medicineModel.findById(id).exec();
    if (!medicine) throw new NotFoundException('Medicine not found');
    return medicine;
  }

  async update(id: string, data: Partial<Medicine>): Promise<Medicine> {
    const updated = await this.medicineModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('Medicine not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.medicineModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Medicine not found');
  }
}
