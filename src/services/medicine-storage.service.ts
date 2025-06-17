import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MedicineStorage,
  MedicineStorageDocument,
} from '@/schemas/medicine-storage.schema';
import { CreateMedicineStorageDto } from '@/decorations/dto/medicine-storage.dto';

@Injectable()
export class MedicineStorageService {
  constructor(
    @InjectModel(MedicineStorage.name)
    private medicineStorageModel: Model<MedicineStorageDocument>,
  ) {}

  async create(
    addMedicine: CreateMedicineStorageDto,
  ): Promise<MedicineStorage> {
    const createdMedicine = new this.medicineStorageModel(addMedicine);
    return createdMedicine.save();
  }

  async findAll() {
    const medicines = await this.medicineStorageModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
    return {
      data: medicines,
      total: medicines.length,
    };
  }

  async findById(id: string): Promise<MedicineStorage> {
    const medicine = await this.medicineStorageModel.findById(id).exec();
    if (!medicine) {
      throw new NotFoundException(`Medicine with ID "${id}" not found`);
    }
    return medicine;
  }

  async findExpiring(days: number): Promise<MedicineStorage[]> {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    return this.medicineStorageModel
      .find({
        expired: { $lte: expiryDate },
        status: { $ne: 'out_of_stock' },
      })
      .sort({ expired: 1 })
      .exec();
  }

  async findLowStock(): Promise<MedicineStorage[]> {
    return this.medicineStorageModel
      .find({
        $expr: {
          $lte: ['$amountLeft', '$minimumStockLevel'],
        },
      })
      .sort({ amountLeft: 1 })
      .exec();
  }

  async update(id: string, updateMedicineDto: any): Promise<MedicineStorage> {
    const medicine = await this.medicineStorageModel
      .findByIdAndUpdate(id, updateMedicineDto, { new: true })
      .exec();

    if (!medicine) {
      throw new NotFoundException(`Medicine with ID "${id}" not found`);
    }
    return medicine;
  }

  async remove(id: string): Promise<void> {
    const result = await this.medicineStorageModel
      .deleteOne({ _id: id })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Medicine with ID "${id}" not found`);
    }
  }

  async createMany(medicines: any[]): Promise<MedicineStorage[]> {
    const created = await this.medicineStorageModel.insertMany(medicines);
    return created.map((doc) => doc.toObject());
  }

  async removeMany(ids: string[]): Promise<void> {
    await this.medicineStorageModel.deleteMany({ _id: { $in: ids } }).exec();
  }

  async getStockStatusReport(): Promise<any> {
    return this.medicineStorageModel
      .aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            medicines: { $push: '$$ROOT' },
          },
        },
        {
          $project: {
            status: '$_id',
            count: 1,
            totalValue: {
              $sum: '$medicines.amountLeft',
            },
            medicines: {
              $map: {
                input: '$medicines',
                as: 'medicine',
                in: {
                  id: '$$medicine._id',
                  name: '$$medicine.name',
                  amountLeft: '$$medicine.amountLeft',
                  expired: '$$medicine.expired',
                },
              },
            },
          },
        },
      ])
      .exec();
  }

  async getExpiryReport(
    startDate: string,
    endDate: string,
  ): Promise<MedicineStorage[]> {
    return this.medicineStorageModel
      .find({
        expired: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      })
      .sort({ expired: 1 })
      .exec();
  }
}
