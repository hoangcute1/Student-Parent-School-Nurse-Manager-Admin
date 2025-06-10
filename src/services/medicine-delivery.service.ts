import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MedicineDelivery,
  MedicineDeliveryDocument,
} from '@/schemas/medicine-delivery.schema';
import {
  CreateMedicineDeliveryDto,
  UpdateMedicineDeliveryDto,
} from '@/decorations/dto/medicine-delivery.dto';

@Injectable()
export class MedicineDeliveryService {
  constructor(
    @InjectModel(MedicineDelivery.name)
    private medicineDeliveryModel: Model<MedicineDeliveryDocument>,
  ) {}

  async create(
    createMedicineDeliveryDto: CreateMedicineDeliveryDto,
  ): Promise<MedicineDelivery> {
    const createdDelivery = new this.medicineDeliveryModel(createMedicineDeliveryDto);
    return createdDelivery.save();
  }
  async findAll(): Promise<MedicineDelivery[]> {
    return this.medicineDeliveryModel.find().select('-__v').populate('student').exec();
  }
  async findByStudent(studentId: string): Promise<MedicineDelivery[]> {
    return this.medicineDeliveryModel
      .find({ student: studentId })
      .select('-__v')
      .populate('student')
      .exec();
  }
  async findById(id: string): Promise<MedicineDelivery> {
    const delivery = await this.medicineDeliveryModel
      .findById(id)
      .select('-__v')
      .populate('student')
      .exec();

    if (!delivery) {
      throw new NotFoundException(`Medicine delivery with ID "${id}" not found`);
    }
    return delivery;
  }
  async update(
    id: string,
    updateMedicineDeliveryDto: UpdateMedicineDeliveryDto,
  ): Promise<MedicineDelivery> {
    const updatedDelivery = await this.medicineDeliveryModel
      .findByIdAndUpdate(id, updateMedicineDeliveryDto, { new: true })
      .select('-__v')
      .populate('student')
      .exec();

    if (!updatedDelivery) {
      throw new NotFoundException(`Medicine delivery with ID "${id}" not found`);
    }
    return updatedDelivery;
  }

  async remove(id: string): Promise<void> {
    const result = await this.medicineDeliveryModel
      .deleteOne({ _id: id })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Medicine delivery with ID "${id}" not found`);
    }
  }
}
