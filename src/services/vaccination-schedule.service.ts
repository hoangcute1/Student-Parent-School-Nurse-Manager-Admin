import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  VaccinationSchedule,
  VaccinationScheduleDocument,
  VaccinationStatus,
} from '@/schemas/vaccination-schedule.schema';
import { NotificationService } from './notification.service';

@Injectable()
export class VaccinationScheduleService {
  constructor(
    @InjectModel(VaccinationSchedule.name)
    private vaccinationScheduleModel: Model<VaccinationScheduleDocument>,
    private notificationService: NotificationService,
  ) {}

  async createVaccinationSchedule(
    title: string,
    description: string,
    vaccination_date: Date,
    vaccination_time: string,
    location: string,
    doctor_name: string,
    vaccine_type: string,
    student_ids: string[],
    grade_level?: number,
  ) {
    const vaccinations: any[] = [];

    for (const student_id of student_ids) {
      try {
        const vaccination = new this.vaccinationScheduleModel({
          title,
          description,
          vaccination_date,
          vaccination_time,
          location,
          doctor_name,
          vaccine_type,
          student_id,
          grade_level,
          status: 'Pending', // Luôn set status là PENDING khi tạo mới
        });

        const savedVaccination = await vaccination.save();
        vaccinations.push(savedVaccination);

        // Gửi thông báo cho phụ huynh
        try {
          await this.notificationService.createVaccinationNotification(
            (savedVaccination._id as any).toString(),
            student_id,
            title,
            description,
            vaccination_date,
            vaccination_time,
          );
        } catch (error) {
          console.error('Error creating notification for vaccination:', error);
        }
      } catch (error) {
        console.error('Error saving vaccination for student', student_id, error); // Log error per student
        throw error;
      }
    }

    return vaccinations;
  }

  async getVaccinationEvents() {
    // Group vaccination schedules by campaign/event
    const vaccinations = await this.vaccinationScheduleModel
      .find({ grade_level: { $exists: true, $ne: null } })
      .populate([
        { path: 'student_id', populate: { path: 'class', select: 'name grade_level' } },
        { path: 'created_by' },
      ])
      .sort({ vaccination_date: -1 });

    // Group by event (same title, date, time, location)
    const eventsMap = new Map();

    for (const vaccination of vaccinations) {
      const eventKey = `${vaccination.title}_${vaccination.vaccination_date}_${vaccination.vaccination_time}_${vaccination.location}`;

      if (!eventsMap.has(eventKey)) {
        eventsMap.set(eventKey, {
          _id: eventKey,
          title: vaccination.title,
          description: vaccination.description,
          vaccination_date: vaccination.vaccination_date,
          vaccination_time: vaccination.vaccination_time,
          location: vaccination.location,
          doctor_name: vaccination.doctor_name,
          vaccine_type: vaccination.vaccine_type,
          created_by: vaccination.created_by,
          grade_levels: new Set(),
          classes: new Map(),
          total_students: 0,
          approved_count: 0,
          pending_count: 0,
          rejected_count: 0,
          completed_count: 0,
          vaccinations: [],
        });
      }

      const event = eventsMap.get(eventKey);
      event.vaccinations.push(vaccination);
      event.total_students += 1;

      // Count by status
      switch (vaccination.status) {
        case VaccinationStatus.APPROVED:
          event.approved_count += 1;
          break;
        case VaccinationStatus.PENDING:
          event.pending_count += 1;
          break;
        case VaccinationStatus.REJECTED:
          event.rejected_count += 1;
          break;
        case VaccinationStatus.COMPLETED:
          event.completed_count += 1;
          break;
      }

      // Track grade levels and classes
      if (vaccination.grade_level) {
        event.grade_levels.add(vaccination.grade_level);
      }

      if (
        vaccination.student_id &&
        typeof vaccination.student_id === 'object' &&
        (vaccination.student_id as any).class
      ) {
        const studentData = vaccination.student_id as any;
        const classData = studentData.class;
        const classId = classData._id.toString();

        if (!event.classes.has(classId)) {
          event.classes.set(classId, {
            class_id: classId,
            class_name: classData.name || `${vaccination.grade_level}A`,
            grade_level: classData.grade_level || vaccination.grade_level,
            students: [],
            approved_count: 0,
            pending_count: 0,
            rejected_count: 0,
            completed_count: 0,
          });
        }

        const classInfo = event.classes.get(classId);
        classInfo.students.push({
          student: vaccination.student_id,
          vaccination: vaccination,
          status: vaccination.status,
        });

        // Count by status for this class
        switch (vaccination.status) {
          case VaccinationStatus.APPROVED:
            classInfo.approved_count += 1;
            break;
          case VaccinationStatus.PENDING:
            classInfo.pending_count += 1;
            break;
          case VaccinationStatus.REJECTED:
            classInfo.rejected_count += 1;
            break;
          case VaccinationStatus.COMPLETED:
            classInfo.completed_count += 1;
            break;
        }
      }
    }

    // Convert Map to Array and process
    const events = Array.from(eventsMap.values()).map((event) => ({
      ...event,
      grade_levels: Array.from(event.grade_levels).sort(),
      classes: Array.from(event.classes.values()),
    }));

    return events;
  }

  async getVaccinationEventDetail(eventId: string) {
    // Extract event details from eventId (title_date_time_location)
    const parts = eventId.split('_');
    const title = parts[0];
    const date = parts[1];
    const time = parts[2];
    const location = parts.slice(3).join('_'); // In case location has underscores

    const vaccinations = await this.vaccinationScheduleModel
      .find({
        title: title,
        vaccination_date: new Date(date),
        vaccination_time: time,
        location: location,
      })
      .populate([
        { path: 'student_id', populate: { path: 'class', select: 'name grade_level' } },
        { path: 'created_by' },
      ])
      .sort({ grade_level: 1 });

    // Group by class
    const classesMap = new Map();

    for (const vaccination of vaccinations) {
      if (
        vaccination.student_id &&
        typeof vaccination.student_id === 'object' &&
        (vaccination.student_id as any).class
      ) {
        const studentData = vaccination.student_id as any;
        const classData = studentData.class;
        const classId = classData._id.toString();

        if (!classesMap.has(classId)) {
          classesMap.set(classId, {
            class_id: classId,
            class_name: classData.name,
            grade_level: classData.grade_level,
            total_students: 0,
            approved_count: 0,
            pending_count: 0,
            rejected_count: 0,
            completed_count: 0,
            students: [],
          });
        }

        const classInfo = classesMap.get(classId);
        classInfo.students.push({
          vaccination_id: vaccination._id,
          student: vaccination.student_id,
          status: vaccination.status,
          parent_response_notes: vaccination.parent_response_notes,
          rejection_reason: vaccination.rejection_reason,
        });

        classInfo.total_students += 1;

        // Count by status
        switch (vaccination.status) {
          case VaccinationStatus.APPROVED:
            classInfo.approved_count += 1;
            break;
          case VaccinationStatus.PENDING:
            classInfo.pending_count += 1;
            break;
          case VaccinationStatus.REJECTED:
            classInfo.rejected_count += 1;
            break;
          case VaccinationStatus.COMPLETED:
            classInfo.completed_count += 1;
            break;
        }
      }
    }

    return {
      event_id: eventId,
      title: title,
      vaccination_date: new Date(date),
      vaccination_time: time,
      location: location,
      classes: Array.from(classesMap.values()).sort((a, b) => a.grade_level - b.grade_level),
    };
  }

  async getVaccinationClassDetail(eventId: string, classId: string) {
    // Extract event details from eventId
    const parts = eventId.split('_');
    const title = parts[0];
    const date = parts[1];
    const time = parts[2];
    const location = parts.slice(3).join('_');

    const vaccinations = await this.vaccinationScheduleModel
      .find({
        title: title,
        vaccination_date: new Date(date),
        vaccination_time: time,
        location: location,
      })
      .populate([
        { path: 'student_id', populate: { path: 'class', select: 'name grade_level' } },
        { path: 'created_by' },
      ]);

    // Filter by class - chỉ lấy học sinh đã đồng ý (APPROVED/AGREED) và đã tiêm (COMPLETED)
    const classVaccinations = vaccinations.filter((vaccination) => {
      if (vaccination.student_id && typeof vaccination.student_id === 'object') {
        const studentData = vaccination.student_id as any;
        // So sánh status không phân biệt hoa/thường
        const st = String(vaccination.status).toUpperCase();
        return (
          studentData.class &&
          studentData.class._id.toString() === classId &&
          (st === 'APPROVED' || st === 'AGREED' || st === 'COMPLETED')
        );
      }
      return false;
    });

    const statusCounts = {
      approved: 0,
      pending: 0,
      rejected: 0,
      completed: 0,
    };

    const students = classVaccinations.map((vaccination) => {
      const studentData = vaccination.student_id as any;

      switch (vaccination.status) {
        case VaccinationStatus.APPROVED:
          statusCounts.approved += 1;
          break;
        case VaccinationStatus.PENDING:
          statusCounts.pending += 1;
          break;
        case VaccinationStatus.REJECTED:
          statusCounts.rejected += 1;
          break;
        case VaccinationStatus.COMPLETED:
          statusCounts.completed += 1;
          break;
      }

      return {
        vaccination_id: vaccination._id,
        student: vaccination.student_id,
        status: vaccination.status,
        parent_response_notes: vaccination.parent_response_notes,
        rejection_reason: vaccination.rejection_reason,
        vaccination_result: vaccination.vaccination_result,
        recommendations: vaccination.recommendations,
        follow_up_required: vaccination.follow_up_required,
        vaccination_notes: vaccination.vaccination_notes,
        created_at: vaccination.created_at,
        updated_at: vaccination.updated_at,
      };
    });

    return {
      class_id: classId,
      class_name:
        classVaccinations[0] && classVaccinations[0].student_id
          ? (classVaccinations[0].student_id as any).class.name
          : '',
      students,
      status_counts: statusCounts,
    };
  }

  async updateVaccinationResult(
    vaccinationId: string,
    updateData: {
      vaccination_result?: string;
      vaccination_notes?: string;
      recommendations?: string;
      follow_up_required?: boolean;
      follow_up_date?: Date;
    },
  ) {
    const vaccination = await this.vaccinationScheduleModel.findById(vaccinationId);

    if (!vaccination) {
      throw new NotFoundException('Vaccination schedule not found');
    }

    // Update vaccination results
    if (updateData.vaccination_result !== undefined) {
      vaccination.vaccination_result = updateData.vaccination_result;
    }
    if (updateData.vaccination_notes !== undefined) {
      vaccination.vaccination_notes = updateData.vaccination_notes;
    }
    if (updateData.recommendations !== undefined) {
      vaccination.recommendations = updateData.recommendations;
    }
    if (updateData.follow_up_required !== undefined) {
      vaccination.follow_up_required = updateData.follow_up_required;
    }
    if (updateData.follow_up_date !== undefined) {
      vaccination.follow_up_date = updateData.follow_up_date;
    }

    // Update status to completed
    vaccination.status = VaccinationStatus.COMPLETED;
    vaccination.updated_at = new Date();

    const savedVaccination = await vaccination.save();

    // If follow-up is required, send notification to parent
    if (updateData.follow_up_required) {
      try {
        // Create a simple notification for follow-up appointment
        const notificationMessage = updateData.follow_up_date
          ? `Cần tư vấn thêm cho con em sau tiêm chủng. Lịch hẹn: ${updateData.follow_up_date.toLocaleDateString()}`
          : 'Cần tư vấn thêm cho con em sau tiêm chủng. Vui lòng liên hệ nhà trường.';

        // TODO: Implement follow-up notification
        console.log('Follow-up notification needed:', {
          vaccinationId,
          studentId: vaccination.student_id.toString(),
          message: notificationMessage,
        });
      } catch (notificationError) {
        console.error('Error sending follow-up notification:', notificationError);
      }
    }

    return savedVaccination.populate(['student_id', 'created_by']);
  }

  async deleteVaccinationSchedule(vaccinationId: string) {
    const vaccination = await this.vaccinationScheduleModel.findById(vaccinationId);

    if (!vaccination) {
      throw new NotFoundException('Vaccination schedule not found');
    }

    // Only allow deletion if status is PENDING
    if (vaccination.status !== VaccinationStatus.PENDING) {
      throw new BadRequestException(
        'Cannot delete vaccination schedule that has been responded to',
      );
    }

    await this.vaccinationScheduleModel.findByIdAndDelete(vaccinationId);
    return { message: 'Vaccination schedule deleted successfully' };
  }

  // Thêm method để cập nhật response từ phụ huynh
  async updateParentResponse(
    vaccinationId: string,
    status: VaccinationStatus,
    responseNotes?: string,
    rejectionReason?: string,
  ) {
    const vaccination = await this.vaccinationScheduleModel.findById(vaccinationId);

    if (!vaccination) {
      throw new NotFoundException('Vaccination schedule not found');
    }

    vaccination.status = status;
    vaccination.parent_response_notes = responseNotes || '';
    vaccination.rejection_reason = rejectionReason || '';
    vaccination.updated_at = new Date();

    return await vaccination.save();
  }

  async getVaccinationResultsByStudent(studentId: string) {
    try {
      const results = await this.vaccinationScheduleModel
        .find({
          student_id: studentId,
          status: { $in: ['Completed', 'COMPLETED'] }, // Fix: include both cases
        })
        .populate('student_id', 'name student_id')
        .populate('created_by', 'name')
        .sort({ vaccination_date: -1 })
        .exec();

      return results.map((schedule) => {
        // Try to get doctor name from vaccination_result JSON first, then from doctor_name field
        let doctorName = schedule.doctor_name;

        if (schedule.vaccination_result) {
          try {
            const parsedResult = JSON.parse(schedule.vaccination_result);
            if (parsedResult.doctor_name) {
              doctorName = parsedResult.doctor_name;
            }
          } catch (error) {
            console.error('Error parsing vaccination result:', error);
          }
        }

        return {
          _id: schedule._id,
          title: schedule.title,
          vaccination_date: schedule.vaccination_date,
          vaccination_time: schedule.vaccination_time,
          location: schedule.location,
          doctor_name:
            doctorName || (schedule.created_by as any)?.name || 'Bác sĩ phụ trách sự kiện',
          vaccine_type: schedule.vaccine_type,
          vaccination_result: schedule.vaccination_result,
          vaccination_notes: schedule.vaccination_notes,
          recommendations: schedule.recommendations,
          follow_up_required: schedule.follow_up_required,
          follow_up_date: schedule.follow_up_date,
          student: schedule.student_id,
          created_at: schedule.created_at,
        };
      });
    } catch (error) {
      console.error('Error fetching vaccination results by student:', error);
      throw error;
    }
  }

  async getPendingVaccinationSchedulesByStudent(studentId: string) {
    try {
      const results = await this.vaccinationScheduleModel
        .find({
          student_id: studentId,
          status: 'Pending',
        })
        .populate('student_id', 'name student_id')
        .populate('created_by', 'name')
        .sort({ vaccination_date: -1 })
        .exec();
      return results;
    } catch (error) {
      console.error('Error fetching pending vaccination schedules by student:', error);
      throw error;
    }
  }

  async getAllSchedules(staffId?: string) {
    const filter: any = {};
    if (staffId) filter.created_by = staffId;
    return this.vaccinationScheduleModel
      .find(filter)
      .populate('student_id')
      .populate('created_by')
      .sort({ vaccination_date: -1 })
      .exec();
  }

  async approveVaccinationSchedule(vaccinationId: string) {
    const vaccination = await this.vaccinationScheduleModel.findById(vaccinationId);
    if (!vaccination) {
      throw new NotFoundException('Vaccination schedule not found');
    }
    vaccination.status = 'Approved';
    vaccination.updated_at = new Date();
    return vaccination.save();
  }

  async cancelVaccinationSchedule(vaccinationId: string) {
    const vaccination = await this.vaccinationScheduleModel.findById(vaccinationId);
    if (!vaccination) {
      throw new NotFoundException('Vaccination schedule not found');
    }
    vaccination.status = 'Rejected';
    vaccination.updated_at = new Date();
    return vaccination.save();
  }
}
