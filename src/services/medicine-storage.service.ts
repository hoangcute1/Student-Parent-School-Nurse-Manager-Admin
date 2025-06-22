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
  MedicineStatus,
} from '@/schemas/medicine-storage.schema';
import {
  CreateMedicineStorageDto,
  UpdateMedicineStorageDto,
} from '@/decorations/dto/medicine-storage.dto';

@Injectable()
export class MedicineStorageService {
  constructor(
    @InjectModel(MedicineStorage.name)
    private medicineStorageModel: Model<MedicineStorageDocument>,
  ) {}

  async create(
    addMedicine: CreateMedicineStorageDto,
  ): Promise<MedicineStorage> {
    // Map from camelCase in DTO to snake_case in schema
    const medicineData = {
      name: addMedicine.name,
      type: addMedicine.type,
      unit: addMedicine.unit,
      amount_left: addMedicine.amountLeft,
      total: addMedicine.total,
      status: addMedicine.status,
      expired: addMedicine.expired,
      description: addMedicine.description,
    };

    const createdMedicine = new this.medicineStorageModel(medicineData);
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
    if (days <= 0) {
      throw new BadRequestException('Days parameter must be greater than 0');
    }

    const currentDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(currentDate.getDate() + days);

    return this.medicineStorageModel
      .find({
        expired: {
          $gte: currentDate, // Chưa hết hạn
          $lte: expiryDate, // Nhưng sẽ hết hạn trong số ngày yêu cầu
        },
        status: { $ne: MedicineStatus.OUT_OF_STOCK }, // Không lấy thuốc đã hết hàng
      })
      .sort({ expired: 1 }) // Sắp xếp theo ngày hết hạn tăng dần
      .exec();
  }

  async findLowStock(): Promise<MedicineStorage[]> {
    // Tìm tất cả các thuốc có trạng thái 'low'
    return this.medicineStorageModel
      .find({
        status: MedicineStatus.LOW,
      })
      .sort({ amount_left: 1 }) // Sắp xếp theo số lượng còn lại tăng dần
      .exec();
  }

  async update(
    id: string,
    updateMedicineDto: UpdateMedicineStorageDto,
  ): Promise<MedicineStorage> {
    // Map from camelCase in DTO to snake_case in schema
    const updateData: any = {};

    if (updateMedicineDto.name !== undefined) {
      updateData.name = updateMedicineDto.name;
    }

    if (updateMedicineDto.type !== undefined) {
      updateData.type = updateMedicineDto.type;
    }

    if (updateMedicineDto.unit !== undefined) {
      updateData.unit = updateMedicineDto.unit;
    }

    if (updateMedicineDto.amountLeft !== undefined) {
      updateData.amount_left = updateMedicineDto.amountLeft;
    }

    if (updateMedicineDto.total !== undefined) {
      updateData.total = updateMedicineDto.total;
    }

    if (updateMedicineDto.status !== undefined) {
      updateData.status = updateMedicineDto.status;
    }

    if (updateMedicineDto.expired !== undefined) {
      updateData.expired = updateMedicineDto.expired;
    }

    if (updateMedicineDto.description !== undefined) {
      updateData.description = updateMedicineDto.description;
    }

    const medicine = await this.medicineStorageModel
      .findByIdAndUpdate(id, updateData, { new: true })
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

  async createMany(
    medicines: CreateMedicineStorageDto[],
  ): Promise<MedicineStorage[]> {
    // Map each medicine from camelCase in DTO to snake_case in schema
    const medicineData = medicines.map((medicine) => ({
      name: medicine.name,
      type: medicine.type,
      unit: medicine.unit,
      amount_left: medicine.amountLeft,
      total: medicine.total,
      status: medicine.status,
      expired: medicine.expired,
      description: medicine.description,
    }));

    const created = await this.medicineStorageModel.insertMany(medicineData);
    return created.map((doc) => doc.toObject());
  }

  async removeMany(ids: string[]): Promise<void> {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('Invalid or empty IDs array');
    }

    const result = await this.medicineStorageModel
      .deleteMany({ _id: { $in: ids } })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('No medicines found with the provided IDs');
    }

    if (result.deletedCount !== ids.length) {
      // Xóa thành công một số nhưng không phải tất cả
      // Có thể log cảnh báo ở đây
    }
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
