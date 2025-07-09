import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TreatmentHistory } from '@/schemas/treatment-history.schema';
import { CreateTreatmentHistoryDto } from '@/decorations/dto/create-treatment-history.dto';
import { UpdateTreatmentHistoryDto } from '@/decorations/dto/update-treatment-history.dto';
import { Student } from '@/schemas/student.schema';

@Injectable()
export class TreatmentHistoryService {
  constructor(
    @InjectModel(TreatmentHistory.name)
    private treatmentHistoryModel: Model<TreatmentHistory>,
    @InjectModel(Student.name)
    private studentModel: Model<Student>,
  ) {}

  async create(createTreatmentHistoryDto: CreateTreatmentHistoryDto): Promise<TreatmentHistory> {
    const createdTreatmentHistory = new this.treatmentHistoryModel(createTreatmentHistoryDto);
    return createdTreatmentHistory.save();
  }

  async findAll(): Promise<TreatmentHistory[]> {
    return this.treatmentHistoryModel
      .find()
      .populate('student')
      .populate('staff')
      .populate('record')
      .exec();
  }

  async findById(id: string): Promise<TreatmentHistory> {
    const treatmentHistory = await this.treatmentHistoryModel
      .findById(id)
      .populate('student')
      .populate('staff')
      .populate('record')
      .exec();

    if (!treatmentHistory) {
      throw new NotFoundException(`Treatment history with ID ${id} not found`);
    }

    return treatmentHistory;
  }

  async findByStudentId(studentId: string): Promise<TreatmentHistory[]> {
    return this.treatmentHistoryModel
      .find({ student: studentId })
      .populate('staff')
      .populate('record')
      .exec();
  }

  async findByStaffId(staffId: string): Promise<TreatmentHistory[]> {
    return this.treatmentHistoryModel
      .find({ staff: staffId })
      .populate('student')
      .populate('record')
      .exec();
  }

  async findByParentId(parentId: string): Promise<TreatmentHistory[]> {
    // First, find all students associated with the parent
    const students = await this.studentModel.find({ parent: parentId }).exec();
    if (!students || students.length === 0) {
      return []; // No students found for this parent
    }
    const studentIds = students.map((s) => s._id);

    // Then, find all treatment histories for those students
    return this.treatmentHistoryModel
      .find({ student: { $in: studentIds } })
      .populate('student')
      .populate('staff')
      .populate('record')
      .exec();
  }

  async update(
    id: string,
    updateTreatmentHistoryDto: UpdateTreatmentHistoryDto,
  ): Promise<TreatmentHistory> {
    const updatedTreatmentHistory = await this.treatmentHistoryModel
      .findByIdAndUpdate(id, updateTreatmentHistoryDto, { new: true })
      .populate('student')
      .populate('staff')
      .populate('record')
      .exec();

    if (!updatedTreatmentHistory) {
      throw new NotFoundException(`Treatment history with ID ${id} not found`);
    }

    return updatedTreatmentHistory;
  }

  async remove(id: string): Promise<TreatmentHistory> {
    const deletedTreatmentHistory = await this.treatmentHistoryModel.findByIdAndDelete(id).exec();

    if (!deletedTreatmentHistory) {
      throw new NotFoundException(`Treatment history with ID ${id} not found`);
    }

    return deletedTreatmentHistory;
  }
}
