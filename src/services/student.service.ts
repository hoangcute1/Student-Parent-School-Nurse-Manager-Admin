import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from '@/schemas/student.schema';
import { CreateStudentDto } from '@/decorations/dto/create-student.dto';
import { UpdateStudentDto } from '@/decorations/dto/update-student.dto';
import { FilterStudentDto, FilterOperator } from '@/decorations/dto/filter-student.dto';
import { SortOrder } from '@/decorations/dto/pagination.dto';
import { ParentService } from '@/services/parent.service';
import { HealthRecordService } from './health-record.service';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    private parentService: ParentService,
    private healthRecordService: HealthRecordService,
  ) {}
  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    // Check if student with this ID already exists
    const existingStudent = await this.studentModel
      .findOne({
        studentId: createStudentDto.studentId,
      })
      .exec();

    if (existingStudent) {
      throw new ConflictException('Mã sinh viên đã tồn tại');
    }

    // Check if parentId exists
    if (createStudentDto.parentId) {
      try {
        await this.parentService.findById(createStudentDto.parentId);
      } catch (error) {
        throw new BadRequestException(
          `Phụ huynh với ID "${createStudentDto.parentId}" không tồn tại`,
        );
      }
    } // Create student data with mapping parentId to parent field
    const studentData = {
      ...createStudentDto,
      parent: createStudentDto.parentId, // Map parentId to parent field
      class: createStudentDto.classId, // Map classId to class field
    };

    const createdStudent = new this.studentModel(studentData);
    const savedStudent = await createdStudent.save();

    // Populate parent and class before returning
    const populatedStudent = await this.studentModel
      .findById(savedStudent._id)
      .populate('parent')
      .populate('class');

    if (!populatedStudent) {
      throw new InternalServerErrorException('Failed to retrieve created student');
    }

    return populatedStudent;
  }
  async batchCreate(createStudentDtos: CreateStudentDto[]): Promise<{
    success: Student[];
    failures: Array<{ dto: CreateStudentDto; reason: string }>;
  }> {
    const results: {
      success: Student[];
      failures: Array<{ dto: CreateStudentDto; reason: string }>;
    } = {
      success: [],
      failures: [],
    };

    // Extract all student IDs to check for duplicates
    const studentIds = createStudentDtos.map((dto) => dto.studentId);

    // Find existing student IDs in the database
    const existingStudents = await this.studentModel
      .find({ studentId: { $in: studentIds } })
      .select('studentId')
      .exec();

    const existingStudentIds = new Set(existingStudents.map((s) => s.studentId));

    // Process each student
    for (const dto of createStudentDtos) {
      try {
        // Check if already exists
        if (existingStudentIds.has(dto.studentId)) {
          results.failures.push({
            dto,
            reason: `Mã sinh viên ${dto.studentId} đã tồn tại`,
          });
          continue;
        } // Create new student with parent mapping
        const studentData = {
          ...dto,
          parent: dto.parentId, // Map parentId to parent field
          class: dto.classId, // Map classId to class field
        };
        const createdStudent = new this.studentModel(studentData);
        const savedStudent = await createdStudent.save();

        // Populate and add to results
        const populatedStudent = await this.studentModel
          .findById(savedStudent._id)
          .populate('parent')
          .populate('class');

        results.success.push(populatedStudent || savedStudent);

        // Add to set to catch duplicates within the batch
        existingStudentIds.add(dto.studentId);
      } catch (error) {
        results.failures.push({
          dto,
          reason: error.message || 'Lỗi không xác định',
        });
      }
    }

    return results;
  }
  async findAll(
    filterDto?: FilterStudentDto,
  ): Promise<{ data: Student[]; total: number; page: number; limit: number }> {
    const {
      page = 1,
      limit = 10,
      sortBy,
      sortOrder = SortOrder.ASC,
      search,
      studentId,
      createdFrom,
      createdTo,
      advancedFilters,
      sortFields,
    } = filterDto || {};

    // Build filter query
    const query: any = {};

    // Basic filters
    if (search) {
      query.fullName = { $regex: search, $options: 'i' };
    }

    if (studentId) {
      query.studentId = { $regex: studentId, $options: 'i' };
    }

    // Date range filtering
    if (createdFrom || createdTo) {
      query.createdAt = {};

      if (createdFrom) {
        query.createdAt.$gte = new Date(createdFrom);
      }

      if (createdTo) {
        query.createdAt.$lte = new Date(createdTo);
      }
    }

    // Advanced filtering
    if (advancedFilters && advancedFilters.length > 0) {
      advancedFilters.forEach((filter) => {
        const { field, operator, value } = filter;

        // Initialize field in query if not exists
        if (!query[field]) {
          query[field] = {};
        }

        switch (operator) {
          case FilterOperator.EQUALS:
            query[field] = value;
            break;
          case FilterOperator.NOT_EQUALS:
            query[field] = { $ne: value };
            break;
          case FilterOperator.GREATER_THAN:
            query[field] = { ...query[field], $gt: value };
            break;
          case FilterOperator.GREATER_THAN_OR_EQUALS:
            query[field] = { ...query[field], $gte: value };
            break;
          case FilterOperator.LESS_THAN:
            query[field] = { ...query[field], $lt: value };
            break;
          case FilterOperator.LESS_THAN_OR_EQUALS:
            query[field] = { ...query[field], $lte: value };
            break;
          case FilterOperator.IN:
            query[field] = { $in: Array.isArray(value) ? value : [value] };
            break;
          case FilterOperator.NOT_IN:
            query[field] = { $nin: Array.isArray(value) ? value : [value] };
            break;
          case FilterOperator.CONTAINS:
            query[field] = { $regex: value, $options: 'i' };
            break;
          case FilterOperator.STARTS_WITH:
            query[field] = { $regex: `^${value}`, $options: 'i' };
            break;
          case FilterOperator.ENDS_WITH:
            query[field] = { $regex: `${value}$`, $options: 'i' };
            break;
        }
      });
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build sort options
    let sort: any = {};

    // Handle multiple sort fields
    if (sortFields && sortFields.length > 0) {
      sort = {};
      sortFields.forEach((sortField) => {
        sort[sortField.field] = sortField.order === SortOrder.ASC ? 1 : -1;
      });
    }
    // Backward compatibility with single sort field
    else if (sortBy) {
      sort[sortBy] = sortOrder === SortOrder.ASC ? 1 : -1;
    } else {
      // Default sort by createdAt if no sort is specified
      sort.createdAt = -1;
    } // Execute query with pagination
    const data = await this.studentModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('parent')
      .populate('class')
      .exec();

    // Get total count for pagination metadata
    const total = await this.studentModel.countDocuments(query).exec();

    return {
      data,
      total,
      page,
      limit,
    };
  }
  async findById(id: string): Promise<any> {
    const studentHealthRecord = await this.healthRecordService.findByStudentId(id);
    const student = await this.studentModel
      .findById(id)
      .populate('parent')
      .populate('class')
      .exec();
    if (!student) {
      throw new NotFoundException(`Sinh viên với ID "${id}" không tìm thấy`);
    }
    return formatStudentbyIdResponse(student, studentHealthRecord);
  }
  async findByStudentId(studentId: string): Promise<Student> {
    const student = await this.studentModel
      .findOne({ studentId })
      .populate('parent')
      .populate('class')
      .exec();
    if (!student) {
      throw new NotFoundException(`Sinh viên với mã "${studentId}" không tìm thấy`);
    }
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    // Check if updating studentId and if it exists already
    if (updateStudentDto.studentId) {
      const existingStudent = await this.studentModel
        .findOne({
          studentId: updateStudentDto.studentId,
          _id: { $ne: id }, // Exclude current student
        })
        .exec();

      if (existingStudent) {
        throw new ConflictException('Mã sinh viên đã tồn tại');
      }
    } // Add updated date and map parentId to parent field
    const updatedData = {
      ...updateStudentDto,
      parent: updateStudentDto.parentId, // Map parentId to parent field
      class: updateStudentDto.classId, // Map classId to class field
      updatedAt: new Date(),
    };
    const updatedStudent = await this.studentModel
      .findByIdAndUpdate(id, updatedData, { new: true })
      .populate('parent')
      .populate('class')
      .exec();

    if (!updatedStudent) {
      throw new NotFoundException(`Sinh viên với ID "${id}" không tìm thấy`);
    }

    return updatedStudent;
  }
  async delete(id: string): Promise<Student> {
    const deletedStudent = await this.studentModel.findByIdAndDelete(id).exec();

    if (!deletedStudent) {
      throw new NotFoundException(`Sinh viên với ID "${id}" không tìm thấy`);
    }

    return deletedStudent;
  }
  async batchDelete(ids: string[]): Promise<{
    successful: string[];
    failed: { id: string; reason: string }[];
  }> {
    const result: {
      successful: string[];
      failed: { id: string; reason: string }[];
    } = {
      successful: [],
      failed: [],
    };

    // Process each ID
    for (const id of ids) {
      try {
        const deletedStudent = await this.studentModel.findByIdAndDelete(id).exec();

        if (!deletedStudent) {
          result.failed.push({
            id,
            reason: `Sinh viên với ID "${id}" không tìm thấy`,
          });
        } else {
          result.successful.push(id);
        }
      } catch (error) {
        result.failed.push({
          id,
          reason: error.message || 'Lỗi không xác định',
        });
      }
    }

    return result;
  }
  async batchUpdate(updates: { id: string; data: UpdateStudentDto }[]): Promise<{
    successful: Student[];
    failed: { id: string; data: UpdateStudentDto; reason: string }[];
  }> {
    const result: {
      successful: Student[];
      failed: { id: string; data: UpdateStudentDto; reason: string }[];
    } = {
      successful: [],
      failed: [],
    };

    // Process each update
    for (const update of updates) {
      try {
        // Check if updating studentId and if it exists already on another student
        if (update.data.studentId) {
          const existingStudent = await this.studentModel
            .findOne({
              studentId: update.data.studentId,
              _id: { $ne: update.id }, // Exclude current student
            })
            .exec();

          if (existingStudent) {
            result.failed.push({
              id: update.id,
              data: update.data,
              reason: `Mã sinh viên "${update.data.studentId}" đã tồn tại trên sinh viên khác`,
            });
            continue;
          }
        } // Add updated date and map fields
        const updatedData = {
          ...update.data,
          parent: update.data.parentId, // Map parentId to parent field
          class: update.data.classId, // Map classId to class field
          updatedAt: new Date(),
        };
        const updatedStudent = await this.studentModel
          .findByIdAndUpdate(update.id, updatedData, { new: true })
          .populate('parent')
          .populate('class')
          .exec();

        if (!updatedStudent) {
          result.failed.push({
            id: update.id,
            data: update.data,
            reason: `Sinh viên với ID "${update.id}" không tìm thấy`,
          });
        } else {
          result.successful.push(updatedStudent);
        }
      } catch (error) {
        result.failed.push({
          id: update.id,
          data: update.data,
          reason: error.message || 'Lỗi không xác định',
        });
      }
    }

    return result;
  }

  // Phương thức này sẽ được gọi từ StudentController thông qua endpoint DELETE
  async remove(id: string): Promise<Student> {
    return this.delete(id);
  }
  async findByParentId(parentId: string): Promise<Student[]> {
    return this.studentModel.find({ parent: parentId }).populate('parent').populate('class').exec();
  }

  async findByClassId(classId: string): Promise<Student[]> {
    return this.studentModel.find({ class: classId }).populate('parent').populate('class').exec();
  }
}

// Helper function to format student data
export const formatStudentResponse = (student: any) => {
  if (!student) return null;

  const result: any = {
    student: {
      _id: student._id,
      studentId: student.studentId,
      name: student.name,
      birth: student.birth,
      gender: student.gender,
      created_at: student.created_at,
      updated_at: student.updated_at,
    },
  };

  // Format class if available
  if (student.class && typeof student.class === 'object') {
    result.class = {
      _id: student.class._id,
      name: student.class.name,
      grade: student.class.grade,
      created_at: student.class.created_at,
      updated_at: student.class.updated_at,
    };
  }

  // Format parent if available
  if (student.parent && typeof student.parent === 'object') {
    result.parent = {
      _id: student.parent._id,
      user: student.parent.user,
      __v: student.parent.__v,
    };
  }

  return result;
};

// Helper function to format student data
export const formatStudentbyIdResponse = (student: any, healthRecord: any) => {
  if (!student) return null;

  const result: any = {
    student: {
      _id: student._id,
      studentId: student.studentId,
      name: student.name,
      birth: student.birth,
      gender: student.gender,
      created_at: student.created_at,
      updated_at: student.updated_at,
    },
  };

  // Format class if available
  if (student.class && typeof student.class === 'object') {
    result.class = {
      _id: student.class._id,
      name: student.class.name,
      grade: student.class.grade,
      created_at: student.class.created_at,
      updated_at: student.class.updated_at,
    };
  }

  // Format parent if available
  if (student.parent && typeof student.parent === 'object') {
    result.parent = {
      _id: student.parent._id,
      user: student.parent.user,
    };
  }

  if (healthRecord && typeof healthRecord === 'object') {
    result.healthRecord = healthRecord;
  }

  return result;
};
