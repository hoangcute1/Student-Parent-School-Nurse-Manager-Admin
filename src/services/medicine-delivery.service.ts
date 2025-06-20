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
  MedicineDeliveryStatus,
} from '@/schemas/medicine-delivery.schema';
import {
  CreateMedicineDeliveryDto,
  UpdateMedicineDeliveryDto,
  ApproveRejectDeliveryDto,
} from '@/decorations/dto/medicine-delivery.dto';

@Injectable()
export class MedicineDeliveryService {
  constructor(
    @InjectModel(MedicineDelivery.name)
    private medicineDeliveryModel: Model<MedicineDeliveryDocument>,
  ) {}

  async create(
    createMedicineDeliveryDto: CreateMedicineDeliveryDto,
  ): Promise<MedicineDeliveryDocument> {
    // Nếu không có sent_at, mặc định sẽ dùng thời gian hiện tại từ schema
    if (!createMedicineDeliveryDto.sent_at) {
      createMedicineDeliveryDto.sent_at = new Date();
    }
    
    const createdDelivery = new this.medicineDeliveryModel(
      createMedicineDeliveryDto,
    );
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

  async findAll(filters?: {
    status?: MedicineDeliveryStatus;
    from?: string;
    to?: string;
  }): Promise<{ data: MedicineDeliveryDocument[]; total: number }> {
    const query: any = {};

    // Apply status filter if provided
    if (filters?.status) {
      query.status = filters.status;
    }

    // Apply date range filter if provided
    if (filters?.from || filters?.to) {
      query.date = {};
      if (filters.from) {
        query.date.$gte = new Date(filters.from);
      }
      if (filters.to) {
        query.date.$lte = new Date(filters.to);
      }
    }

    const data = await this.medicineDeliveryModel
      .find(query)
      .populate('student', 'name studentId class')
      .populate('staff', 'name email role')
      .populate('medicine', 'name dosage unit type')
      .sort({ createdAt: -1 })
      .exec();

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

  async findByStatus(
    status: MedicineDeliveryStatus,
  ): Promise<MedicineDeliveryDocument[]> {
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
      throw new NotFoundException(
        `Medicine delivery with ID "${id}" not found`,
      );
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
      throw new BadRequestException(
        `Cannot update a delivery with status "${delivery.status}"`,
      );
    }

    const updatedDelivery = await this.medicineDeliveryModel
      .findByIdAndUpdate(id, updateMedicineDeliveryDto, { new: true })
      .populate('student', 'name studentId class')
      .populate('staff', 'name email role')
      .populate('medicine', 'name dosage unit type')
      .exec();

    if (!updatedDelivery) {
      throw new NotFoundException(
        `Medicine delivery with ID "${id}" not found`,
      );
    }

    return updatedDelivery;
  }

  async approveOrReject(
    id: string,
    dto: ApproveRejectDeliveryDto,
    staffId: string,
  ): Promise<MedicineDeliveryDocument> {
    const delivery = await this.findById(id);

    // Only pending deliveries can be approved or rejected
    if (delivery.status !== MedicineDeliveryStatus.PENDING) {
      throw new BadRequestException(
        `Cannot approve or reject a delivery with status "${delivery.status}"`,
      );
    }

    // Update status and staff
    const update: any = {
      status: dto.status,
    };

    // Add note if provided
    if (dto.note) {
      update.note = dto.note;
    }

    const updatedDelivery = await this.medicineDeliveryModel
      .findByIdAndUpdate(id, update, { new: true })
      .populate('student', 'name studentId class')
      .populate('staff', 'name email role')
      .populate('medicine', 'name dosage unit type')
      .exec();

    if (!updatedDelivery) {
      throw new NotFoundException(
        `Medicine delivery with ID "${id}" not found`,
      );
    }

    return updatedDelivery;
  }

  async complete(id: string): Promise<MedicineDeliveryDocument> {
    const delivery = await this.findById(id);

    // Only approved deliveries can be completed
    if (delivery.status !== MedicineDeliveryStatus.APPROVED) {
      throw new BadRequestException(
        `Cannot complete a delivery with status "${delivery.status}". Only approved deliveries can be completed.`,
      );
    }

    const updatedDelivery = await this.medicineDeliveryModel
      .findByIdAndUpdate(
        id,
        { status: MedicineDeliveryStatus.COMPLETED },
        { new: true },
      )
      .populate('student', 'name studentId class')
      .populate('staff', 'name email role')
      .populate('medicine', 'name dosage unit type')
      .exec();

    if (!updatedDelivery) {
      throw new NotFoundException(
        `Medicine delivery with ID "${id}" not found`,
      );
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
      throw new NotFoundException(
        `Medicine delivery with ID "${id}" not found`,
      );
    }

    return updatedDelivery;
  }

  async remove(id: string): Promise<void> {
    const delivery = await this.findById(id);

    // Cannot delete completed or approved deliveries
    if (
      delivery.status === MedicineDeliveryStatus.COMPLETED ||
      delivery.status === MedicineDeliveryStatus.APPROVED
    ) {
      throw new BadRequestException(
        `Cannot delete a delivery with status "${delivery.status}"`,
      );
    }

    const result = await this.medicineDeliveryModel
      .deleteOne({ _id: id })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(
        `Medicine delivery with ID "${id}" not found`,
      );
    }
  }
}
