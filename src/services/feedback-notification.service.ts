import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FeedbackNotification,
  FeedbackNotificationDocument,
  UserRole,
} from '@/schemas/feedback-notification.schema';
import {
  CreateFeedbackNotificationDto,
  UpdateFeedbackNotificationDto,
} from '@/decorations/dto/feedback-notification.dto';

@Injectable()
export class FeedbackNotificationService {
  constructor(
    @InjectModel(FeedbackNotification.name)
    private feedbackNotificationModel: Model<FeedbackNotificationDocument>,
  ) {}

  async create(createDto: CreateFeedbackNotificationDto): Promise<FeedbackNotification> {
    const notification = new this.feedbackNotificationModel(createDto);
    return notification.save();
  }

  async createBulk(createDtos: CreateFeedbackNotificationDto[]): Promise<any[]> {
    return this.feedbackNotificationModel.insertMany(createDtos);
  }

  async findAll(): Promise<FeedbackNotification[]> {
    return this.feedbackNotificationModel
      .find()
      .populate('feedback')
      .populate('recipient', 'username email role')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByRecipient(recipientId: string): Promise<FeedbackNotification[]> {
    return this.feedbackNotificationModel
      .find({ recipient: recipientId })
      .populate('feedback')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByRole(role: UserRole): Promise<FeedbackNotification[]> {
    return this.feedbackNotificationModel
      .find({ recipientRole: role })
      .populate('feedback')
      .populate('recipient', 'username email role')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findUnreadByRecipient(recipientId: string): Promise<FeedbackNotification[]> {
    return this.feedbackNotificationModel
      .find({ recipient: recipientId, isRead: false })
      .populate('feedback')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<FeedbackNotification> {
    const notification = await this.feedbackNotificationModel
      .findById(id)
      .populate('feedback')
      .populate('recipient', 'username email role')
      .exec();

    if (!notification) {
      throw new NotFoundException(`Feedback notification with ID "${id}" not found`);
    }
    return notification;
  }

  async update(
    id: string,
    updateDto: UpdateFeedbackNotificationDto,
  ): Promise<FeedbackNotification> {
    const notification = await this.feedbackNotificationModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .populate('feedback')
      .populate('recipient', 'username email role')
      .exec();

    if (!notification) {
      throw new NotFoundException(`Feedback notification with ID "${id}" not found`);
    }
    return notification;
  }

  async markAsRead(id: string): Promise<FeedbackNotification> {
    return this.update(id, { isRead: true });
  }

  async markAllAsReadByRecipient(recipientId: string): Promise<void> {
    await this.feedbackNotificationModel
      .updateMany({ recipient: recipientId, isRead: false }, { isRead: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.feedbackNotificationModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Feedback notification with ID "${id}" not found`);
    }
  }

  async getUnreadCount(recipientId: string): Promise<number> {
    return this.feedbackNotificationModel
      .countDocuments({ recipient: recipientId, isRead: false })
      .exec();
  }
}
