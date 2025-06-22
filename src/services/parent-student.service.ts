import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ParentStudent, ParentStudentDocument } from '@/schemas/parent-student.schema';
import { CreateParentStudentDto } from '@/decorations/dto/create-parent-student.dto';
import { UpdateParentStudentDto } from '@/decorations/dto/update-parent-student.dto';
import { StudentService } from './student.service';
import { HealthRecordService } from './health-record.service';

@Injectable()
export class ParentStudentService {
  constructor(
    @InjectModel(ParentStudent.name)
    private parentStudentModel: Model<ParentStudentDocument>,
    @Inject(forwardRef(() => StudentService))
    private healthRecordService: HealthRecordService,
  ) {}

  async create(createParentStudentDto: CreateParentStudentDto): Promise<ParentStudent> {
    const createdParentStudent = new this.parentStudentModel(createParentStudentDto);
    return createdParentStudent.save();
  }

  async findAll(): Promise<ParentStudent[]> {
    return this.parentStudentModel.find().populate('parent').populate('student').exec();
  }

  async findById(id: string): Promise<ParentStudent> {
    const parentStudent = await this.parentStudentModel
      .findById(id)
      .populate('parent')
      .populate('student')
      .exec();

    if (!parentStudent) {
      throw new NotFoundException(`Parent-Student relationship with ID ${id} not found`);
    }

    return parentStudent;
  }

  async findByParentId(parentId: string): Promise<ParentStudent[]> {
    return this.parentStudentModel.find({ parent: parentId }).populate('student').exec();
  }

  async findByStudentId(studentId: string): Promise<ParentStudent[]> {
    return this.parentStudentModel.find({ student: studentId }).populate('parent').exec();
  }

  async update(id: string, updateParentStudentDto: UpdateParentStudentDto): Promise<ParentStudent> {
    const updatedParentStudent = await this.parentStudentModel
      .findByIdAndUpdate(id, updateParentStudentDto, { new: true })
      .populate('parent')
      .populate('student')
      .exec();

    if (!updatedParentStudent) {
      throw new NotFoundException(`Parent-Student relationship with ID ${id} not found`);
    }

    return updatedParentStudent;
  }

  async remove(id: string): Promise<ParentStudent> {
    const deletedParentStudent = await this.parentStudentModel.findByIdAndDelete(id).exec();

    if (!deletedParentStudent) {
      throw new NotFoundException(`Parent-Student relationship with ID ${id} not found`);
    }

    return deletedParentStudent;
  }

  /**
   * Find all students for a parent including their health records
   */
  async findStudentsWithHealthRecordsByParentId(parentId: string): Promise<any[]> {
    // Find all parent-student relationships for this parent
    const parentStudents = await this.parentStudentModel
      .find({ parent: parentId })
      .populate({
        path: 'student',
        populate: {
          path: 'class',
          select: 'name grade',
        },
      })
      .exec();

    // If no relationships found, return empty array
    if (!parentStudents || parentStudents.length === 0) {
      return [];
    }

    // For each student, fetch their health record
    const studentsWithHealthRecords = await Promise.all(
      parentStudents.map(async (ps) => {
        const student = ps.student as any; // Type assertion to avoid compilation errors

        // Fetch the health record for this student
        const healthRecord = await this.healthRecordService.findByStudentId(student._id.toString());

        // Return combined data
        return {
          _id: student._id,
          studentId: student.studentId,
          firstName: student.firstName,
          lastName: student.lastName,
          dateOfBirth: student.dateOfBirth,
          gender: student.gender,
          address: student.address,
          class: student.class,
          healthRecord: healthRecord || null,
        };
      }),
    );

    return studentsWithHealthRecords;
  }
}
