import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from '@/schemas/notification.schema';
import { CreateNotificationDto } from '@/decorations/dto/create-notification.dto';
import { UpdateNotificationDto } from '@/decorations/dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}
  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const created = new this.notificationModel({
      ...createNotificationDto,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return created.save();
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationModel
      .find()
      .populate('parent')
      .populate('student')
      .exec();
  }
  async findById(id: string): Promise<Notification> {
    const found = await this.notificationModel
      .findById(id)
      .populate('parent')
      .populate('student')
      .exec();

    if (!found) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    return found;
  }

  async findByParentId(parentId: string): Promise<Notification[]> {
    return this.notificationModel
      .find({ parent: parentId })
      .populate('student')
      .exec();
  }

  async findByStudentId(studentId: string): Promise<Notification[]> {
    return this.notificationModel
      .find({ student: studentId })
      .populate('parent')
      .exec();
  }
  async update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const updated = await this.notificationModel
      .findByIdAndUpdate(
        id,
        { ...updateNotificationDto, updated_at: new Date() },
        { new: true },
      )
      .populate('parent')
      .populate('student')
      .exec();

    if (!updated) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.notificationModel.findByIdAndDelete(id).exec();

    if (!deleted) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }
  }
}
