import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HealthRecord, HealthRecordDocument } from '@/schemas/health-record.schema';
import { CreateHealthRecordDto, UpdateHealthRecordDto } from '@/decorations/dto/health-record.dto';
import { StudentService } from './student.service';
import { ParentService } from './parent.service';
import { ParentStudentService } from './parent-student.service';

@Injectable()
export class HealthRecordService {
  constructor(
    @InjectModel(HealthRecord.name)
    private healthRecordModel: Model<HealthRecordDocument>,
    @Inject(forwardRef(() => StudentService))
    private studentService: StudentService,
    @Inject(forwardRef(() => ParentService))
    private parentService: ParentService,
    @Inject(forwardRef(() => ParentStudentService))
    private parentStudentService: ParentStudentService,
  ) {}

  /**
   * Format health record response with populated student data
   */
  private formatHealthRecordResponse(record: any): any {
    const plainRecord = record.toObject ? record.toObject() : record;
    const studentData = plainRecord.student_id;

    if (!studentData) {
      return {
        _id: plainRecord._id,
        allergies: plainRecord.allergies || 'None',
        chronic_conditions: plainRecord.chronic_conditions || 'None',
        height: plainRecord.height,
        weight: plainRecord.weight,
        vision: plainRecord.vision || 'Normal',
        hearing: plainRecord.hearing || 'Normal',
        blood_type: plainRecord.blood_type,
        treatment_history: plainRecord.treatment_history,
        notes: plainRecord.notes,
        created_at: plainRecord.created_at,
        updated_at: plainRecord.updated_at,
      };
    }

    return {
      _id: plainRecord._id,
      allergies: plainRecord.allergies || 'None',
      chronic_conditions: plainRecord.chronic_conditions || 'None',
      height: plainRecord.height,
      weight: plainRecord.weight,
      vision: plainRecord.vision || 'Normal',
      hearing: plainRecord.hearing || 'Normal',
      blood_type: plainRecord.blood_type,
      treatment_history: plainRecord.treatment_history,
      notes: plainRecord.notes,
      created_at: plainRecord.created_at,
      updated_at: plainRecord.updated_at,
      student: {
        _id: studentData._id,
        name: studentData.name,
        studentId: studentData.studentId,
        birth: studentData.birth,
        gender: studentData.gender,
        class: studentData.class,
        // Add other needed student fields here
      },
    };
  }

  /**
   * Create a new health record
   */
  async create(createHealthRecordDto: CreateHealthRecordDto): Promise<any> {
    // Verify student exists unless called from StudentService
    if (createHealthRecordDto.student_id) {
      try {
        // Check if student exists
        const studentExists = await this.studentService
          .findById(createHealthRecordDto.student_id)
          .catch(() => null);

        if (!studentExists) {
          throw new BadRequestException('Student not found');
        }
      } catch (error) {
        // If called from StudentService during student creation, allow it to continue
        if (error.message !== 'Student not found') {
          throw error;
        }
        console.log(
          `Creating health record for new student with ID: ${createHealthRecordDto.student_id}`,
        );
      }
    }

    // Check if health record already exists for this student
    const existingRecord = await this.healthRecordModel.findOne({
      student_id: createHealthRecordDto.student_id,
    });

    if (existingRecord) {
      throw new BadRequestException('Health record already exists for this student');
    }

    // Create new health record
    const newHealthRecord = new this.healthRecordModel(createHealthRecordDto);
    const savedRecord = await newHealthRecord.save();

    // Return the created health record after populating student data
    const populatedRecord = await this.healthRecordModel
      .findById(savedRecord._id)
      .populate('student_id')
      .exec();

    return this.formatHealthRecordResponse(populatedRecord);
  }

  /**
   * Find all health records
   */
  async findAll(): Promise<any[]> {
    const healthRecords = await this.healthRecordModel
      .find()
      .populate('student_id')
      .sort({ created_at: -1 })
      .exec();

    return healthRecords.map((record) => this.formatHealthRecordResponse(record));
  }

  /**
   * Find health records with filters
   */
  async findWithFilters(filters: {
    student_id?: string;
    blood_type?: string;
    allergies?: string;
  }): Promise<any[]> {
    const query: any = {};

    if (filters.student_id) {
      query.student_id = filters.student_id;
    }

    if (filters.blood_type) {
      query.blood_type = filters.blood_type;
    }

    if (filters.allergies) {
      query.allergies = { $regex: filters.allergies, $options: 'i' };
    }

    const healthRecords = await this.healthRecordModel
      .find(query)
      .populate('student_id')
      .sort({ created_at: -1 })
      .exec();

    return healthRecords.map((record) => this.formatHealthRecordResponse(record));
  }

  /**
   * Find health record by ID
   */
  async findById(id: string): Promise<any> {
    const healthRecord = await this.healthRecordModel.findById(id).populate('student_id').exec();

    if (!healthRecord) {
      throw new NotFoundException('Health record not found');
    }

    return this.formatHealthRecordResponse(healthRecord);
  }

  /**
   * Find health record by student ID
   */
  async findByStudentId(studentId: string): Promise<any> {
    const record = await this.healthRecordModel.findOne({ student_id: studentId }).exec();

    if (!record) {
      return null;
    }

    return this.formatHealthRecordResponse(record);
  }

  /**
   * Update health record
   */
  async update(id: string, updateHealthRecordDto: UpdateHealthRecordDto): Promise<any> {
    const healthRecord = await this.healthRecordModel
      .findByIdAndUpdate(
        id,
        { $set: { ...updateHealthRecordDto, updated_at: new Date() } },
        { new: true }
      )
      .populate('student_id')
      .exec();

    if (!healthRecord) {
      throw new NotFoundException('Health record not found');
    }

    return this.formatHealthRecordResponse(healthRecord);
  }

  /**
   * Delete health record
   */
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

  async getHealthRecordsByStudentId(studentId: string): Promise<any> {
    try {
      const healthRecords = await this.healthRecordModel
        .findOne({
          student_id: studentId,
        })
        .exec();
      if (!healthRecords) {
        throw new NotFoundException(`Health records for student ID "${studentId}" not found`);
      }
      return this.formatHealthRecordResponse(healthRecords);
    } catch (error) {
      console.error(`Error fetching health records for student ID ${studentId}:`, error);
      throw new NotFoundException(`Health records for student ID "${studentId}" not found`);
    }
  }

  async removeByStudentId(studentId: string): Promise<void> {
    await this.healthRecordModel.deleteMany({ student_id: studentId });
  }
}
