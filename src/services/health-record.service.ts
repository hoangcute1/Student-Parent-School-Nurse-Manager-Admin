import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  HealthRecord,
  HealthRecordDocument,
} from '@/schemas/health-record.schema';
import { CreateHealthRecordDto } from '@/decorations/dto/create-health-record.dto';
import { UpdateHealthRecordDto } from '@/decorations/dto/update-health-record.dto';
import { StudentService } from './student.service';

@Injectable()
export class HealthRecordService {
  constructor(
    @InjectModel(HealthRecord.name)
    private healthRecordModel: Model<HealthRecordDocument>,
    @Inject(forwardRef(() => StudentService))
    private studentService: StudentService,
  ) {}

  async create(
    createHealthRecordDto: CreateHealthRecordDto,
  ): Promise<HealthRecord> {
    // Skip student verification if called from StudentService during student creation
    // to avoid circular dependency issues
    if (createHealthRecordDto.student_id) {
      try {
        // Try to find the student but don't throw if not found when called from StudentService
        const studentExists = await this.studentService
          .findById(createHealthRecordDto.student_id)
          .catch(() => null);

        if (!studentExists) {
          console.log(
            `Creating health record for new student with ID: ${createHealthRecordDto.student_id}`,
          );
        }
      } catch (error) {
        // Just log the error but continue with creating the health record
        console.error(
          'Warning: Could not verify student existence:',
          error.message,
        );
      }
    }

    // Check if health record already exists for this student
    const existingRecord = await this.healthRecordModel.findOne({
      student_id: createHealthRecordDto.student_id,
    });

    if (existingRecord) {
      throw new BadRequestException(
        'Health record already exists for this student',
      );
    }

    const newHealthRecord = new this.healthRecordModel(createHealthRecordDto);
    return newHealthRecord.save();
  }

  async findAll(): Promise<any[]> {
    const healthRecords = await this.healthRecordModel
      .find()
      .populate('student_id')
      .exec();

    return healthRecords.map((record) => {
      const plainRecord: any = record.toObject();
      const studentData: any = plainRecord.student_id;

      return {
        _id: plainRecord._id,
        allergies: plainRecord.allergies,
        chronic_conditions: plainRecord.chronic_conditions,
        treatment_history: plainRecord.treatment_history,
        vision: plainRecord.vision,
        notes: plainRecord.notes,
        student_id: {
          _id: studentData._id,
          name: studentData.name,
          studentId: studentData.studentId,
          birth: studentData.birth,
          gender: studentData.gender,
          grade: studentData.grade,
          class: studentData.class,
        },
      };
    });
  }

  async findById(id: string): Promise<any> {
    const healthRecord = await this.healthRecordModel
      .findById(id)
      .populate('student_id')
      .exec();
    if (!healthRecord) {
      throw new NotFoundException('Health record not found');
    }

    const plainRecord: any = healthRecord.toObject();
    const studentData: any = plainRecord.student_id;

    return {
      _id: plainRecord._id,
      allergies: plainRecord.allergies,
      chronic_conditions: plainRecord.chronic_conditions,
      treatment_history: plainRecord.treatment_history,
      vision: plainRecord.vision,
      notes: plainRecord.notes,
      student_id: {
        _id: studentData._id,
        name: studentData.name,
        studentId: studentData.studentId,
        birth: studentData.birth,
        gender: studentData.gender,
        grade: studentData.grade,
        class: studentData.class,
      },
    };
  }

  async findByStudentId(studentId: string): Promise<any> {
    const healthRecord = await this.healthRecordModel
      .findOne({ student_id: studentId })
      .populate('student_id')
      .exec();

    if (!healthRecord) {
      throw new NotFoundException('Health record not found for this student');
    }

    const plainRecord: any = healthRecord.toObject();
    const studentData: any = plainRecord.student_id;

    return {
      _id: plainRecord._id,
      allergies: plainRecord.allergies,
      chronic_conditions: plainRecord.chronic_conditions,
      treatment_history: plainRecord.treatment_history,
      vision: plainRecord.vision,
      notes: plainRecord.notes,
      student_id: {
        _id: studentData._id,
        name: studentData.name,
        studentId: studentData.studentId,
        birth: studentData.birth,
        gender: studentData.gender,
        grade: studentData.grade,
        class: studentData.class,
      },
    };
  }

  async update(
    id: string,
    updateHealthRecordDto: UpdateHealthRecordDto,
  ): Promise<any> {
    const healthRecord = await this.healthRecordModel
      .findByIdAndUpdate(id, updateHealthRecordDto, { new: true })
      .populate('student_id')
      .exec();

    if (!healthRecord) {
      throw new NotFoundException('Health record not found');
    }

    const plainRecord: any = healthRecord.toObject();
    const studentData: any = plainRecord.student_id;

    return {
      _id: plainRecord._id,
      allergies: plainRecord.allergies,
      chronic_conditions: plainRecord.chronic_conditions,
      treatment_history: plainRecord.treatment_history,
      vision: plainRecord.vision,
      notes: plainRecord.notes,
      student_id: {
        _id: studentData._id,
        name: studentData.name,
        studentId: studentData.studentId,
        birth: studentData.birth,
        gender: studentData.gender,
        grade: studentData.grade,
        class: studentData.class,
      },
    };
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const result = await this.healthRecordModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException('Health record not found');
    }

    return {
      success: true,
      message: 'Health record deleted successfully',
    };
  }
}
