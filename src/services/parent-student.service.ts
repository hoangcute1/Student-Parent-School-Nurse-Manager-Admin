import { Parent } from '@/schemas/parent.schema';
import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ParentStudent, ParentStudentDocument } from '@/schemas/parent-student.schema';
import { CreateParentStudentDto } from '@/decorations/dto/create-parent-student.dto';
import { UpdateParentStudentDto } from '@/decorations/dto/update-parent-student.dto';
import { StudentService } from './student.service';
import { HealthRecordService } from './health-record.service';
import { ParentService } from './parent.service';
import path from 'path';

@Injectable()
export class ParentStudentService {
  constructor(
    @InjectModel(ParentStudent.name)
    private parentStudentModel: Model<ParentStudentDocument>,
    @Inject(forwardRef(() => HealthRecordService))
    private healthRecordService: HealthRecordService,
    private parentService: ParentService,
  ) {}

  async create(createParentStudentDto: CreateParentStudentDto): Promise<ParentStudent> {
    const createdParentStudent = new this.parentStudentModel(createParentStudentDto);
    return createdParentStudent.save();
  }

  async findAll(): Promise<ParentStudent[]> {
    this.healthRecordService.getHealthRecordsByStudentId;
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
  async findByUserId(userId: string): Promise<any[]> {
    const parent = (await this.parentService.findByUserId(userId)) as Parent;
    if (!parent) {
      throw new NotFoundException(`Parent with user ID "${userId}" not found`);
    }
    const parentId = (parent as any)._id.toString();
    const parentStudents = await this.parentStudentModel
      .find({ parent: parentId })
      .populate({
        path: 'student',
        populate: {
          path: 'class',
          select: 'name',
        },
  })
      .populate('parent')
      .lean() // <-- Add lean() to get plain JS objects
      .exec();
    if (!parentStudents || parentStudents.length === 0) {
      return [];
    }
    const studentsWithHealthRecords = await Promise.all(
      parentStudents.map(async (ps: any) => {
        const student = ps.student;
        const parentObj = ps.parent;
        const healthRecord = await this.healthRecordService.getHealthRecordsByStudentId(
          student._id.toString(),
        );

        return {
          student,
          parent: parentObj,
          healthRecord: healthRecord || null,
        };
      }),
    );
    return studentsWithHealthRecords;
  }
}
