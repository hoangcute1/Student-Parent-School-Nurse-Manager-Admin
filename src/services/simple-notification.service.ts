import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SimpleNotification,
  SimpleNotificationDocument,
} from '@/schemas/simple-notification.schema';
import { CreateSimpleNotificationDto } from '@/decorations/dto/simple-notification.dto';

@Injectable()
export class SimpleNotificationService {
  constructor(
    @InjectModel(SimpleNotification.name)
    private simpleNotificationModel: Model<SimpleNotificationDocument>,
  ) {}

  async create(createNotificationDto: CreateSimpleNotificationDto): Promise<SimpleNotification> {
    // Prepare data for schema, convert consultation_date to Date if present
    const schemaData: any = {
      ...createNotificationDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (
      createNotificationDto.consultation_date &&
      typeof createNotificationDto.consultation_date === 'string'
    ) {
      schemaData.consultation_date = new Date(createNotificationDto.consultation_date);
    }
    const created = new this.simpleNotificationModel(schemaData);
    return created.save();
  }

  async findAll(): Promise<SimpleNotification[]> {
    return this.simpleNotificationModel
      .find()
      .populate('parent')
      .populate('student')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<SimpleNotification> {
    const found = await this.simpleNotificationModel
      .findById(id)
      .populate('parent')
      .populate('student')
      .exec();

    if (!found) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    return found;
  }

  async findByParentId(parentId: string): Promise<SimpleNotification[]> {
    return this.simpleNotificationModel
      .find({ parent: parentId })
      .populate('student')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByStudentId(studentId: string): Promise<SimpleNotification[]> {
    return this.simpleNotificationModel
      .find({ student: studentId })
      .populate('parent')
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAsRead(id: string): Promise<SimpleNotification> {
    const updated = await this.simpleNotificationModel
      .findByIdAndUpdate(id, { isRead: true, updatedAt: new Date() }, { new: true })
      .populate('parent')
      .populate('student')
      .exec();

    if (!updated) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.simpleNotificationModel.findByIdAndDelete(id).exec();

    if (!deleted) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }
  }
}
