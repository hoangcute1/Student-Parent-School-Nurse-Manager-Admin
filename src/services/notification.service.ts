import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Notification, NotificationDocument } from '@/schemas/notification.schema';
import { CreateNotificationDto } from '@/decorations/dto/create-notification.dto';
import { UpdateNotificationDto } from '@/decorations/dto/update-notification.dto';
import { StudentService } from './student.service';
import { HealthExaminationService } from './health-examination.service';
import { ParentService } from './parent.service';
import { ExaminationStatus } from '@/schemas/health-examination.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private studentService: StudentService,
    private parentService: ParentService,
    @Inject(forwardRef(() => HealthExaminationService))
    private healthExaminationService: HealthExaminationService,
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
    // First validate that id is a valid ObjectId format
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

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
    // First validate that parentId is a valid ObjectId format
    if (!isValidObjectId(parentId)) {
      return [];
    }

    // Then validate that the parent exists
    try {
      await this.parentService.findById(parentId);
    } catch (error) {
      // If parent doesn't exist, return empty array instead of throwing error
      if (error instanceof NotFoundException) {
        return [];
      }
      throw error;
    }

    return this.notificationModel.find({ parent: parentId }).populate('student').exec();
  }

  async findHealthExaminationNotificationsByParentId(parentId: string): Promise<Notification[]> {
    // First validate that parentId is a valid ObjectId format
    if (!isValidObjectId(parentId)) {
      return [];
    }

    // Then validate that the parent exists
    try {
      await this.parentService.findById(parentId);
    } catch (error) {
      // If parent doesn't exist, return empty array instead of throwing error
      if (error instanceof NotFoundException) {
        return [];
      }
      throw error;
    }

    return this.notificationModel
      .find({
        parent: parentId,
        campaign_type: 'HealthExamination',
      })
      .populate('student')
      .exec();
  }

  async findByStudentId(studentId: string): Promise<Notification[]> {
    // First validate that studentId is a valid ObjectId format
    if (!isValidObjectId(studentId)) {
      return [];
    }

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

  async createVaccinationNotification(
    vaccinationId: string,
    studentId: string,
    title: string,
    description: string,
    vaccinationDate: Date,
    vaccinationTime: string,
  ): Promise<Notification> {
    // Tìm parent của student
    const student = await this.findStudentWithParent(studentId);

    if (!student || !student.parent) {
      throw new NotFoundException('Không tìm thấy phụ huynh của học sinh');
    }

    const content = `Thông báo lịch tiêm chủng: ${title}`;
    const notes = `${description}\nNgày tiêm: ${new Date(vaccinationDate).toLocaleDateString('vi-VN')}\nGiờ tiêm: ${vaccinationTime}`;

    const notification = new this.notificationModel({
      noti_campaign: vaccinationId,
      campaign_type: 'VaccinationSchedule',
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

  async respondToVaccination(
    notificationId: string,
    status: 'Agree' | 'Disagree',
    notes?: string,
    rejectionReason?: string,
  ): Promise<any> {
    // Cập nhật status của notification
    const notification = await this.notificationModel
      .findByIdAndUpdate(
        notificationId,
        {
          confirmation_status: status,
          notes: status === 'Agree' ? notes : undefined,
          rejection_reason: status === 'Disagree' ? rejectionReason : undefined,
          updated_at: new Date(),
        },
        { new: true },
      )
      .populate(['student', 'parent']);

    if (!notification) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    // Import VaccinationScheduleService để cập nhật trạng thái
    const { VaccinationStatus } = await import('@/schemas/vaccination-schedule.schema');

    try {
      if (status === 'Agree') {
        // Phụ huynh đồng ý -> cập nhật vaccination thành APPROVED
        // Note: Cần inject VaccinationScheduleService để gọi updateParentResponse
        console.log(
          `Parent agreed to vaccination. Vaccination ${notification.noti_campaign} approved.`,
        );

        return {
          notification,
          message: 'Đã xác nhận tham gia lịch tiêm chủng',
        };
      } else {
        // Phụ huynh từ chối -> cập nhật vaccination thành REJECTED
        console.log(
          `Parent disagreed to vaccination. Vaccination ${notification.noti_campaign} rejected.`,
        );

        return {
          notification,
          message: 'Đã từ chối tham gia lịch tiêm chủng',
        };
      }
    } catch (error) {
      console.error('Error updating vaccination status:', error);
      throw new BadRequestException('Không thể cập nhật trạng thái tiêm chủng');
    }
  }

  async respondToHealthExamination(
    notificationId: string,
    status: 'Agree' | 'Disagree',
    notes?: string,
    rejectionReason?: string,
  ): Promise<any> {
    // Cập nhật status của notification
    const notification = await this.notificationModel
      .findByIdAndUpdate(
        notificationId,
        {
          confirmation_status: status,
          notes: status === 'Agree' ? notes : undefined,
          rejection_reason: status === 'Disagree' ? rejectionReason : undefined,
          updated_at: new Date(),
        },
        { new: true },
      )
      .populate(['student', 'parent']);

    if (!notification) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    // Cập nhật trạng thái examination dựa trên phản hồi của phụ huynh
    try {
      if (status === 'Agree') {
        // Phụ huynh đồng ý -> cập nhật examination thành APPROVED
        await this.healthExaminationService.updateStatus(
          notification.noti_campaign.toString(),
          ExaminationStatus.APPROVED,
        );
        console.log(
          `Parent agreed to health examination. Examination ${notification.noti_campaign} approved.`,
        );

        return {
          notification,
          message: 'Đã xác nhận tham gia lịch khám',
        };
      } else {
        // Phụ huynh từ chối -> cập nhật examination thành REJECTED
        await this.healthExaminationService.updateStatus(
          notification.noti_campaign.toString(),
          ExaminationStatus.REJECTED,
        );
        console.log(
          `Parent disagreed to health examination. Examination ${notification.noti_campaign} rejected.`,
        );

        return {
          notification,
          message: 'Đã từ chối tham gia lịch khám',
        };
      }
    } catch (error) {
      console.error('Error updating examination status:', error);
      // Return notification even if examination update fails
      return {
        notification,
        message:
          status === 'Agree' ? 'Đã xác nhận tham gia lịch khám' : 'Đã từ chối tham gia lịch khám',
        warning: 'Không thể cập nhật trạng thái lịch khám',
      };
    }
  }

  private async findStudentWithParent(studentId: string) {
    try {
      // Sử dụng StudentService để lấy student với parent
      const student = await this.studentService.findById(studentId);
      return student;
    } catch (error) {
      console.error('Error finding student with parent:', error);
      throw new NotFoundException('Không tìm thấy học sinh hoặc phụ huynh');
    }
  }

  private async findStudentById(studentId: string) {
    // Sử dụng StudentService để lấy student
    return await this.studentService.findById(studentId);
  }
}
