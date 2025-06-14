import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medicine, MedicineDocument } from '@/schemas/medicine.schema';
import { CreateMedicineDto } from '@/decorations/dto/create-medicine.dto';
import { UpdateMedicineDto } from '@/decorations/dto/update-medicine.dto';

@Injectable()
export class MedicineService {
  constructor(
    @InjectModel(Medicine.name)
    private medicineModel: Model<MedicineDocument>,
  ) {}

  async create(createMedicineDto: CreateMedicineDto): Promise<Medicine> {
    const createdMedicine = new this.medicineModel(createMedicineDto);
    return createdMedicine.save();
  }

  async findAll(): Promise<Medicine[]> {
    return this.medicineModel.find().exec();
  }

  async findById(id: string): Promise<Medicine> {
    const medicine = await this.medicineModel.findById(id).exec();
    if (!medicine) {
      throw new NotFoundException(`Medicine with ID ${id} not found`);
    }
    return medicine;
  }

  async update(id: string, updateMedicineDto: UpdateMedicineDto): Promise<Medicine> {
    const updatedMedicine = await this.medicineModel
      .findByIdAndUpdate(id, updateMedicineDto, { new: true })
      .exec();
    
    if (!updatedMedicine) {
      throw new NotFoundException(`Medicine with ID ${id} not found`);
    }
    
    return updatedMedicine;
  }

  async remove(id: string): Promise<Medicine> {
    const deletedMedicine = await this.medicineModel.findByIdAndDelete(id).exec();
    
    if (!deletedMedicine) {
      throw new NotFoundException(`Medicine with ID ${id} not found`);
    }
    
    return deletedMedicine;
  }
}
