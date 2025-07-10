import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from '@/schemas/notification.schema';
import { CreateNotificationDto } from '@/decorations/dto/create-notification.dto';
import { UpdateNotificationDto } from '@/decorations/dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}
  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
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
      .populate('noti_campaign')
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
    return this.notificationModel.find({ parent: parentId }).populate('student').exec();
  }

  async findByStudentId(studentId: string): Promise<Notification[]> {
    return this.notificationModel.find({ student: studentId }).populate('parent').exec();
  }
  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    const updated = await this.notificationModel
      .findByIdAndUpdate(id, { ...updateNotificationDto, updated_at: new Date() }, { new: true })
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

  async createHealthExaminationNotification(
    examinationId: string,
    studentId: string,
    title: string,
    description: string,
    examinationDate: Date,
    examinationTime: string,
  ): Promise<Notification> {
    // Tìm parent của student
    const student = await this.findStudentWithParent(studentId);

    if (!student || !student.parent) {
      throw new NotFoundException('Không tìm thấy phụ huynh của học sinh');
    }

    const content = `Thông báo lịch khám sức khỏe: ${title}`;
    const notes = `${description}\nNgày khám: ${new Date(examinationDate).toLocaleDateString('vi-VN')}\nGiờ khám: ${examinationTime}`;

    const notification = new this.notificationModel({
      noti_campaign: examinationId,
      campaign_type: 'HealthExamination',
      parent: student.parent,
      student: studentId,
      content,
      notes,
      date: new Date(),
      confirmation_status: 'Pending',
      created_at: new Date(),
      updated_at: new Date(),
    });

    return notification.save();
  }

  async respondToHealthExamination(
    notificationId: string,
    status: 'Agree' | 'Disagree',
    notes?: string,
    rejectionReason?: string,
  ): Promise<any> {
    // Cập nhật status của notification
    const notification = await this.notificationModel.findByIdAndUpdate(
      notificationId,
      {
        confirmation_status: status,
        updated_at: new Date(),
      },
      { new: true },
    );

    if (!notification) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    // Nếu là health examination, cập nhật status của examination
    if (notification.campaign_type === 'HealthExamination') {
      const HealthExaminationService =
        require('./health-examination.service').HealthExaminationService;

      const examinationStatus = status === 'Agree' ? 'Approved' : 'Rejected';

      // Import động để tránh circular dependency
      const { HealthExaminationService: ExamService } = await import(
        './health-examination.service'
      );
      // Note: Bạn cần inject HealthExaminationService properly hoặc tạo instance

      return {
        notification,
        message: status === 'Agree' ? 'Đã xác nhận tham gia lịch khám' : 'Đã từ chối lịch khám',
      };
    }

    return notification;
  }

  private async findStudentWithParent(studentId: string) {
    try {
      // Tìm student và populate parent
      const student = await this.findStudentById(studentId);
      return student;
    } catch (error) {
      console.error('Error finding student with parent:', error);
      throw new NotFoundException('Không tìm thấy học sinh hoặc phụ huynh');
    }
  }

  private async findStudentById(studentId: string) {
    // Tạm thời mock - bạn cần inject StudentModel hoặc StudentService
    // để thực hiện query thực sự
    return {
      _id: studentId,
      parent: 'mock_parent_id', // Thay thế bằng logic thực tế
    };
  }
}
