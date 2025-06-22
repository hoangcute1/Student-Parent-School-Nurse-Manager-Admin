import { UserService } from './user.service';
import { StaffService } from './staff.service';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MedicineDelivery,
  MedicineDeliveryDocument,
  MedicineDeliveryStatus,
} from '@/schemas/medicine-delivery.schema';
import {
  CreateMedicineDeliveryDto,
  UpdateMedicineDeliveryDto,
} from '@/decorations/dto/medicine-delivery.dto';
import { ParentService } from './parent.service';

@Injectable()
export class MedicineDeliveryService {
  constructor(
    @InjectModel(MedicineDelivery.name)
    private medicineDeliveryModel: Model<MedicineDeliveryDocument>,
    private parentService: ParentService,
    private userService: UserService,
    private staffService: StaffService,
  ) {}

  async create(
    createMedicineDeliveryDto: CreateMedicineDeliveryDto,
  ): Promise<MedicineDeliveryDocument> {
    // Nếu không có sent_at, mặc định sẽ dùng thời gian hiện tại từ schema
    if (!createMedicineDeliveryDto.sent_at) {
      createMedicineDeliveryDto.sent_at = new Date();
    }

    const createdDelivery = new this.medicineDeliveryModel(createMedicineDeliveryDto);
    await createdDelivery.save();

    // Populate data sau khi lưu để có thông tin đầy đủ
    const populatedDelivery = await this.medicineDeliveryModel
      .findById(createdDelivery._id)
      .populate('student', 'name studentId class')
      .populate('staff', 'name email role')
      .populate('medicine', 'name dosage unit type')
      .exec();

    if (!populatedDelivery) {
      throw new Error('Failed to find created delivery');
    }

    return populatedDelivery;
  }
  async findAll(): Promise<{ data: any; total: number }> {
    const medicineDeliveryList = await this.medicineDeliveryModel
      .find()
      .populate({ path: 'student', populate: { path: 'class', select: 'name' } })
      .populate('staff')
      .populate('parent')
      .populate('medicine')
      .sort({ created_at: -1 })
      .exec();
    console.log('Medicine Delivery List:', medicineDeliveryList);
    const data = await Promise.all(
      medicineDeliveryList.map(async (item) => {
        const { _id, parent, staff, ...rest } = item.toObject();
        const parentUserId = (item.parent as any).user.toString();
        const parentName = ((await this.userService.getUserProfile(parentUserId)).profile as any)
          .name;
        const staffUserId = (item.staff as any).user.toString();
        const staffName = ((await this.userService.getUserProfile(staffUserId)).profile as any)
          .name;
        return {
          id: item._id,
          parentName: parentName,
          staffName: staffName,
          ...rest,
        };
      }),
    );

    return {
      data,
      total: data.length,
    };
  }

  async findByStudent(
    studentId: string,
    status?: MedicineDeliveryStatus,
  ): Promise<MedicineDeliveryDocument[]> {
    const query: any = { student: studentId };

    if (status) {
      query.status = status;
    }

    return this.medicineDeliveryModel
      .find(query)
      .populate('student', 'name studentId class')
      .populate('staff', 'name email role')
      .populate('medicine', 'name dosage unit type')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByStatus(status: MedicineDeliveryStatus): Promise<MedicineDeliveryDocument[]> {
    return this.medicineDeliveryModel
      .find({ status })
      .populate('student', 'name studentId class')
      .populate('staff', 'name email role')
      .populate('medicine', 'name dosage unit type')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByDateRange(from: Date, to: Date): Promise<MedicineDeliveryDocument[]> {
    return this.medicineDeliveryModel
      .find({
        date: {
          $gte: from,
          $lte: to,
        },
      })
      .populate('student', 'name studentId class')
      .populate('staff', 'name email role')
      .populate('medicine', 'name dosage unit type')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<MedicineDeliveryDocument> {
    const delivery = await this.medicineDeliveryModel
      .findById(id)
      .populate('student', 'name studentId class')
      .populate('staff', 'name email role')
      .populate('medicine', 'name dosage unit type')
      .exec();

    if (!delivery) {
      throw new NotFoundException(`Medicine delivery with ID "${id}" not found`);
    }
    return delivery;
  }

  async update(
    id: string,
    updateMedicineDeliveryDto: UpdateMedicineDeliveryDto,
  ): Promise<MedicineDeliveryDocument> {
    const delivery = await this.findById(id);

    // Don't allow updating completed or cancelled deliveries
    if (
      delivery.status === MedicineDeliveryStatus.COMPLETED ||
      delivery.status === MedicineDeliveryStatus.CANCELLED
    ) {
      throw new BadRequestException(`Cannot update a delivery with status "${delivery.status}"`);
    }

    const updatedDelivery = await this.medicineDeliveryModel
      .findByIdAndUpdate(id, updateMedicineDeliveryDto, { new: true })
      .populate('student', 'name studentId class')
      .populate('staff', 'name email role')
      .populate('medicine', 'name dosage unit type')
      .exec();

    if (!updatedDelivery) {
      throw new NotFoundException(`Medicine delivery with ID "${id}" not found`);
    }

    return updatedDelivery;
  }

  async complete(id: string): Promise<MedicineDeliveryDocument> {
    const delivery = await this.findById(id);

    const updatedDelivery = await this.medicineDeliveryModel
      .findByIdAndUpdate(id, { status: MedicineDeliveryStatus.COMPLETED }, { new: true })
      .populate('student', 'name studentId class')
      .populate('staff', 'name email role')
      .populate('medicine', 'name dosage unit type')
      .exec();

    if (!updatedDelivery) {
      throw new NotFoundException(`Medicine delivery with ID "${id}" not found`);
    }

    return updatedDelivery;
  }

  async cancel(id: string, note?: string): Promise<MedicineDeliveryDocument> {
    const delivery = await this.findById(id);

    // Cannot cancel completed deliveries
    if (delivery.status === MedicineDeliveryStatus.COMPLETED) {
      throw new BadRequestException(`Cannot cancel a completed delivery`);
    }

    const update: any = {
      status: MedicineDeliveryStatus.CANCELLED,
    };

    // Add cancellation note if provided
    if (note) {
      update.note = note;
    }

    const updatedDelivery = await this.medicineDeliveryModel
      .findByIdAndUpdate(id, update, { new: true })
      .populate('student', 'name studentId class')
      .populate('staff', 'name email role')
      .populate('medicine', 'name dosage unit type')
      .exec();

    if (!updatedDelivery) {
      throw new NotFoundException(`Medicine delivery with ID "${id}" not found`);
    }

    return updatedDelivery;
  }

  async remove(id: string): Promise<void> {
    const delivery = await this.findById(id);

    // Cannot delete completed or approved deliveries
    if (
      delivery.status === MedicineDeliveryStatus.COMPLETED ||
      delivery.status === MedicineDeliveryStatus.CANCELLED
    ) {
      throw new BadRequestException(`Cannot delete a delivery with status "${delivery.status}"`);
    }

    const result = await this.medicineDeliveryModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Medicine delivery with ID "${id}" not found`);
    }
  }
}
