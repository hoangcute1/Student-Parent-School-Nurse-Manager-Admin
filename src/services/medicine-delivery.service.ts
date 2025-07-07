import { UserService } from './user.service';
import { StaffService } from './staff.service';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

    const data = await Promise.all(
      medicineDeliveryList.map(async (item) => {
        const { _id, parent, staff, ...rest } = item.toObject();

        const parentUserId = (item.parent as any).user?.toString();
        const parentName = ((await this.userService.getUserProfile(parentUserId)).profile as any)
          ?.name;
        const staffUserId = (item.staff as any).user?.toString();
        const staffName = ((await this.userService.getUserProfile(staffUserId)).profile as any)
          ?.name;

        return {
          id: item._id,
          parentId:
            typeof item.parent === 'object' && '_id' in item.parent
              ? (item.parent as any)._id.toString()
              : item.parent?.toString() || parent, // lấy id parent
          staffId:
            typeof item.staff === 'object' && '_id' in item.staff
              ? (item.staff as any)._id.toString()
              : item.staff?.toString() || staff, // lấy id staff
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

  async findByUserId(userId: string): Promise<{ data: any[]; total: number }> {
    const parentId = await this.parentService.findByUserId(userId);
    const medicineDeliveryList = await this.medicineDeliveryModel
      .find({ parent: parentId })
      .populate({ path: 'student', populate: { path: 'class', select: 'name' } })
      .populate('staff')
      .populate('parent')
      .populate('medicine')
      .sort({ created_at: -1 })
      .exec();

    const data = await Promise.all(
      medicineDeliveryList.map(async (item) => {
        const { _id, parent, staff, ...rest } = item.toObject();

        // Lấy tên staff
        let staffName = '';
        if (item.staff && (item.staff as any).user) {
          const staffUserId = (item.staff as any).user.toString();
          staffName =
            ((await this.userService.getUserProfile(staffUserId)).profile as any)?.name || '';
        }

        return {
          id: item._id,
          staffId: staff ? (item.staff as any)._id.toString() : '',
          staffName,
          ...rest,
        };
      }),
    );

    return {
      data,
      total: data.length,
    };
  }

  async findByUserStaff(userId: string): Promise<{ data: any[]; total: number }> {
    const staffId = await this.staffService.findByUserId(userId);
    const medicineDeliveryList = await this.medicineDeliveryModel
      .find({
        staff: staffId,
        hiddenFromStaff: { $ne: staffId }, // Exclude deliveries hidden from this staff member
      })
      .populate({ path: 'student', populate: { path: 'class', select: 'name' } })
      .populate('staff')
      .populate('parent')
      .populate('medicine')
      .sort({ created_at: -1 })
      .exec();

    const data = await Promise.all(
      medicineDeliveryList.map(async (item) => {
        const { _id, parent, staff, ...rest } = item.toObject();

        // Lấy tên staff
        let parentName = '';
        if (item.parent && (item.parent as any).user) {
          const staffUserId = (item.parent as any).user.toString();
          parentName =
            ((await this.userService.getUserProfile(staffUserId)).profile as any)?.name || '';
        }

        return {
          id: item._id,
          parentId: parent ? (item.parent as any)._id.toString() : '',
          parentName,
          ...rest,
        };
      }),
    );

    return {
      data,
      total: data.length,
    };
  }

  async createByStudentId(
    createMedicineDeliveryDto: CreateMedicineDeliveryDto,
  ): Promise<MedicineDeliveryDocument> {
    // Đảm bảo có studentId và parentId trong DTO
    if (!createMedicineDeliveryDto.student) {
      throw new BadRequestException('Missing studentId in request');
    }
    if (!createMedicineDeliveryDto.parent) {
      throw new BadRequestException('Missing parentId in request');
    }

    // Nếu không có sent_at, mặc định sẽ dùng thời gian hiện tại từ schema
    if (!createMedicineDeliveryDto.sent_at) {
      createMedicineDeliveryDto.sent_at = new Date();
    }

    // Kiểm tra parent có tồn tại không
    const parent = await this.parentService.findById(createMedicineDeliveryDto.parent);
    if (!parent) {
      throw new NotFoundException('Parent not found');
    }

    // (Tùy chọn) Có thể kiểm tra student tồn tại nếu muốn

    const createdDelivery = new this.medicineDeliveryModel(createMedicineDeliveryDto);
    await createdDelivery.save();

    // Populate data sau khi lưu để có thông tin đầy đủ
    const populatedDelivery = await this.medicineDeliveryModel
      .findById(createdDelivery._id)
      .populate({
        path: 'student',
        select: 'name studentId class',
        populate: { path: 'class', select: 'name' },
      })
      .populate('staff', 'name email role')
      .populate('medicine', 'name dosage unit type')
      .populate('parent', 'user')
      .exec();

    if (!populatedDelivery) {
      throw new Error('Failed to find created delivery');
    }

    return populatedDelivery;
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

  async update(
    id: string,
    updateDto: UpdateMedicineDeliveryDto,
  ): Promise<MedicineDeliveryDocument> {
    try {
      const delivery = await this.medicineDeliveryModel
        .findByIdAndUpdate(id, { $set: updateDto }, { new: true, runValidators: true })
        .populate('student', 'name studentId class')
        .populate('staff', 'name email role')
        .populate('medicine', 'name dosage unit type');

      if (!delivery) {
        throw new NotFoundException(`Medicine delivery with ID ${id} not found`);
      }

      return delivery;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update medicine delivery: ${error.message}`);
    }
  }

  async findById(id: string): Promise<{ delivery: MedicineDeliveryDocument; staffName: string }> {
    const delivery = await this.medicineDeliveryModel
      .findById(id)
      .populate({ path: 'student', populate: { path: 'class', select: 'name' } })
      .populate('staff')
      .populate('parent')
      .populate('medicine')
      .exec();

    if (!delivery) {
      throw new NotFoundException(`Medicine delivery with ID "${id}" not found`);
    }

    let staffName = '';
    if (delivery.staff && (delivery.staff as any).user) {
      const staffUserId = (delivery.staff as any).user.toString();
      staffName = ((await this.userService.getUserProfile(staffUserId)).profile as any)?.name || '';
    }

    return { delivery, staffName };
  }

  async remove(id: string): Promise<void> {
    const delivery = await this.findById(id);

    // Cannot delete completed or approved deliveries
    if (
      delivery.delivery.status === MedicineDeliveryStatus.COMPLETED ||
      delivery.delivery.status === MedicineDeliveryStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Cannot delete a delivery with status "${delivery.delivery.status}"`,
      );
    }

    const result = await this.medicineDeliveryModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Medicine delivery with ID "${id}" not found`);
    }
  }

  async softDelete(id: string, staffId: string): Promise<void> {
    const delivery = await this.medicineDeliveryModel.findById(id).exec();

    if (!delivery) {
      throw new NotFoundException(`Medicine delivery with ID "${id}" not found`);
    }

    // Add staff ID to hiddenFromStaff array if not already present
    const staffObjectId = new Types.ObjectId(staffId);
    if (!delivery.hiddenFromStaff.some((hiddenId) => hiddenId.toString() === staffId)) {
      await this.medicineDeliveryModel
        .updateOne({ _id: id }, { $addToSet: { hiddenFromStaff: staffObjectId } })
        .exec();
    }
  }
}
