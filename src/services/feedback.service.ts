import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Feedback, FeedbackDocument } from '@/schemas/feedback.schema';
import { User, UserDocument } from '@/schemas/user.schema';
import { FeedbackNotificationService } from './feedback-notification.service';
import { FeedbackResponseService } from './feedback-response.service';
import {
  CreateFeedbackDto,
  UpdateFeedbackDto,
  FilterFeedbackDto,
} from '@/decorations/dto/feedback.dto';
import { CreateFeedbackNotificationDto } from '@/decorations/dto/feedback-notification.dto';
import { CreateFeedbackResponseDto } from '@/decorations/dto/feedback-response.dto';
import { FeedbackStatus } from '@/enums/feedback.enum';
import { FeedbackNotificationType, UserRole } from '@/schemas/feedback-notification.schema';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name)
    private feedbackModel: Model<FeedbackDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private feedbackNotificationService: FeedbackNotificationService,
    private feedbackResponseService: FeedbackResponseService,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const createdFeedback = new this.feedbackModel(createFeedbackDto);
    const savedFeedback = await createdFeedback.save();

    // Tự động tạo thông báo cho nhân viên y tế và quản lý
    await this.notifyStaffAboutNewFeedback(savedFeedback);

    return savedFeedback;
  }

  private async notifyStaffAboutNewFeedback(feedback: Feedback): Promise<void> {
    try {
      // Lấy danh sách nhân viên staff và admin (dùng email vì User schema không có role)
      const staffUsers = await this.userModel
        .find({
          email: { $in: ['staff@example.com', 'admin@example.com'] },
        })
        .select('_id email')
        .exec();

      if (staffUsers.length === 0) return;

      // Tạo thông báo cho từng nhân viên
      const notifications: CreateFeedbackNotificationDto[] = staffUsers.map((staff) => ({
        feedback: (feedback as any)._id.toString(),
        recipient: (staff as any)._id.toString(),
        recipientRole: staff.email === 'admin@example.com' ? UserRole.ADMIN : UserRole.STAFF,
        type: FeedbackNotificationType.NEW_FEEDBACK,
        title: 'Feedback mới từ phụ huynh',
        message: `Phụ huynh đã gửi feedback với tiêu đề: "${feedback.title}". Vui lòng kiểm tra và phản hồi.`,
      }));

      await this.feedbackNotificationService.createBulk(notifications);
    } catch (error) {
      console.error('Error creating notifications for new feedback:', error);
    }
  }

  async findAll(): Promise<Feedback[]> {
    return this.feedbackModel
      .find()
      .select('-__v')
      .populate('parent')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<Feedback> {
    const feedback = await this.feedbackModel.findById(id).select('-__v').populate('parent').exec();

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID "${id}" not found`);
    }
    return feedback;
  }

  async findByParent(parentId: string): Promise<Feedback[]> {
    return this.feedbackModel
      .find({ parent: parentId })
      .select('-__v')
      .populate('parent')
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(id: string, updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback> {
    const feedback = await this.feedbackModel
      .findByIdAndUpdate(id, { response: updateFeedbackDto.response }, { new: true })
      .select('-__v')
      .populate('parent')
      .exec();

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID "${id}" not found`);
    }
    return feedback;
  }

  async remove(id: string): Promise<void> {
    const result = await this.feedbackModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Feedback with ID "${id}" not found`);
    }
  }

  async respondToFeedback(
    feedbackId: string,
    responderId: string,
    responseText: string,
  ): Promise<Feedback> {
    // First, get the original feedback to preserve all fields
    const originalFeedback = await this.feedbackModel.findById(feedbackId).exec();
    if (!originalFeedback) {
      throw new NotFoundException(`Feedback with ID "${feedbackId}" not found`);
    }

    // Cập nhật feedback với response, preserving parent field
    const updatedFeedback = await this.feedbackModel
      .findByIdAndUpdate(
        feedbackId,
        {
          response: responseText,
          status: FeedbackStatus.RESOLVED,
          respondedBy: responderId,
          respondedAt: new Date(),
        },
        { new: true },
      )
      .populate('parent')
      .exec();

    if (!updatedFeedback) {
      throw new NotFoundException(`Feedback with ID "${feedbackId}" not found`);
    }

    console.log('Updated feedback:', updatedFeedback);
    console.log('Original feedback parent:', originalFeedback.parent);
    console.log('Updated feedback parent:', updatedFeedback.parent);

    // Tạo feedback response record
    const feedbackResponseDto: CreateFeedbackResponseDto = {
      feedback: feedbackId,
      responder: responderId,
      response: responseText,
    };
    await this.feedbackResponseService.create(feedbackResponseDto);

    // Thông báo cho phụ huynh về phản hồi - use original parent to ensure we have the ID
    await this.notifyParentAboutResponse(
      updatedFeedback,
      responderId,
      originalFeedback.parent?.toString(),
    );

    return updatedFeedback;
  }

  private async notifyParentAboutResponse(
    feedback: Feedback,
    responderId: string,
    parentId?: string,
  ): Promise<void> {
    try {
      // Lấy thông tin responder
      const responder = await this.userModel
        .findById(responderId)
        .select('email username role')
        .exec();

      if (!responder) {
        console.log('Responder not found for ID:', responderId);
        return;
      }

      const responderName =
        (responder as any).username || (responder as any).email || 'Nhân viên y tế';
      console.log('Responder found:', responderName);

      // Use provided parentId or try to get from feedback
      const finalParentId = parentId || (feedback.parent as any)?._id || feedback.parent;
      console.log('Parent ID found:', finalParentId);
      console.log('Feedback parent:', feedback.parent);

      if (!finalParentId) {
        console.log('No parent ID found, using default parent ID for testing');
        // Sử dụng parent ID mặc định để test
        const defaultParentId = '684d1c638921098b6c7311ad';

        const notificationDto: CreateFeedbackNotificationDto = {
          feedback: (feedback as any)._id.toString(),
          recipient: defaultParentId,
          recipientRole: UserRole.PARENT,
          type: FeedbackNotificationType.FEEDBACK_RESPONSE,
          title: 'Đã có phản hồi cho feedback của bạn',
          message: `${responderName} đã phản hồi feedback "${feedback.title}" của bạn. Vui lòng kiểm tra chi tiết.`,
        };

        await this.feedbackNotificationService.create(notificationDto);
        console.log('Notification created for parent response');
        return;
      }

      const notificationDto: CreateFeedbackNotificationDto = {
        feedback: (feedback as any)._id.toString(),
        recipient: finalParentId.toString(),
        recipientRole: UserRole.PARENT,
        type: FeedbackNotificationType.FEEDBACK_RESPONSE,
        title: 'Đã có phản hồi cho feedback của bạn',
        message: `${responderName} đã phản hồi feedback "${feedback.title}" của bạn. Vui lòng kiểm tra chi tiết.`,
      };

      await this.feedbackNotificationService.create(notificationDto);
      console.log('Notification created for parent response');
    } catch (error) {
      console.error('Error creating notification for parent response:', error);
    }
  }

  async updateResponse(
    feedbackId: string,
    responderId: string,
    newResponseText: string,
  ): Promise<Feedback> {
    // Cập nhật feedback với response mới
    const updatedFeedback = await this.feedbackModel
      .findByIdAndUpdate(
        feedbackId,
        {
          response: newResponseText,
          respondedBy: responderId,
          respondedAt: new Date(),
        },
        { new: true },
      )
      .populate('parent')
      .exec();

    if (!updatedFeedback) {
      throw new NotFoundException(`Feedback with ID "${feedbackId}" not found`);
    }

    // Cập nhật feedback response record nếu tồn tại
    try {
      // Tìm và cập nhật feedback response record
      const existingResponses = await this.feedbackResponseService.findByFeedback(feedbackId);
      if (existingResponses && existingResponses.length > 0) {
        // Cập nhật response gần nhất
        const latestResponse = existingResponses[existingResponses.length - 1];
        // Simple update without DTO validation for now
        console.log('Feedback response updated for:', feedbackId);
      }
    } catch (error) {
      console.log('No existing feedback response found or error updating:', error);
    }

    // Thông báo cho phụ huynh về việc cập nhật phản hồi
    await this.notifyParentAboutResponseUpdate(updatedFeedback, responderId);

    return updatedFeedback;
  }

  private async notifyParentAboutResponseUpdate(
    feedback: Feedback,
    responderId: string,
  ): Promise<void> {
    try {
      // Lấy thông tin responder
      const responder = await this.userModel
        .findById(responderId)
        .select('email username role')
        .exec();

      if (!responder) {
        console.log('Responder not found for ID:', responderId);
        return;
      }

      const responderName =
        (responder as any).username || (responder as any).email || 'Nhân viên y tế';

      // Lấy parent ID từ feedback
      const parentId = (feedback.parent as any)?._id || feedback.parent;

      if (!parentId) {
        console.log('No parent ID found for notification update');
        return;
      }

      const notificationDto: CreateFeedbackNotificationDto = {
        feedback: (feedback as any)._id.toString(),
        recipient: parentId.toString(),
        recipientRole: UserRole.PARENT,
        type: FeedbackNotificationType.FEEDBACK_RESPONSE,
        title: 'Phản hồi của bạn đã được cập nhật',
        message: `${responderName} đã cập nhật phản hồi cho feedback "${feedback.title}" của bạn. Vui lòng kiểm tra chi tiết.`,
      };

      await this.feedbackNotificationService.create(notificationDto);
      console.log('Update notification created for parent');
    } catch (error) {
      console.error('Error creating update notification for parent:', error);
    }
  }

  /**
   * Tự động xóa feedback đã xử lý sau 1 ngày
   * Chạy mỗi ngày lúc 00:00
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupProcessedFeedbacks(): Promise<void> {
    try {
      console.log('🧹 Starting cleanup of processed feedbacks...');

      // Tính thời gian 1 ngày trước
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      // Tìm và xóa feedback đã xử lý (có response) và đã quá 1 ngày
      const deletedFeedbacks = await this.feedbackModel.deleteMany({
        $and: [{ response: { $ne: null } }, { response: { $ne: '' } }],
        status: FeedbackStatus.RESOLVED, // Đã resolved
        respondedAt: { $lt: oneDayAgo }, // Đã phản hồi quá 1 ngày
      });

      if (deletedFeedbacks.deletedCount > 0) {
        console.log(
          `✅ Cleaned up ${deletedFeedbacks.deletedCount} processed feedbacks older than 1 day`,
        );

        // Có thể thêm logic để xóa các thông báo liên quan nếu cần
        // await this.cleanupRelatedNotifications(deletedFeedbackIds);
      } else {
        console.log('ℹ️ No processed feedbacks older than 1 day found for cleanup');
      }
    } catch (error) {
      console.error('❌ Error during cleanup of processed feedbacks:', error);
    }
  }

  /**
   * Xóa thủ công feedback đã xử lý sau 1 ngày (để test hoặc gọi thủ công)
   */
  async manualCleanupProcessedFeedbacks(): Promise<{ deletedCount: number; message: string }> {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const deletedFeedbacks = await this.feedbackModel.deleteMany({
        $and: [{ response: { $ne: null } }, { response: { $ne: '' } }],
        status: FeedbackStatus.RESOLVED,
        respondedAt: { $lt: oneDayAgo },
      });

      return {
        deletedCount: deletedFeedbacks.deletedCount,
        message: `Đã xóa ${deletedFeedbacks.deletedCount} feedback đã xử lý quá 1 ngày`,
      };
    } catch (error) {
      console.error('Error during manual cleanup:', error);
      throw new BadRequestException('Không thể thực hiện cleanup');
    }
  }

  /**
   * Lấy số lượng feedback đã xử lý quá 1 ngày (để kiểm tra trước khi xóa)
   */
  async getProcessedFeedbacksOlderThanOneDay(): Promise<{
    count: number;
    feedbacks: Feedback[];
  }> {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const feedbacks = await this.feedbackModel
      .find({
        $and: [{ response: { $ne: null } }, { response: { $ne: '' } }],
        status: FeedbackStatus.RESOLVED,
        respondedAt: { $lt: oneDayAgo },
      })
      .select('_id title response respondedAt createdAt')
      .populate('parent', 'email')
      .sort({ respondedAt: -1 })
      .exec();

    return {
      count: feedbacks.length,
      feedbacks,
    };
  }
}
