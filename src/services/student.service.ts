import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from '@/schemas/student.schema';
import { CreateStudentDto } from '@/decorations/dto/create-student.dto';
import { UpdateStudentDto } from '@/decorations/dto/update-student.dto';
import {
  FilterStudentDto,
  FilterOperator,
} from '@/decorations/dto/filter-student.dto';
import { SortOrder } from '@/decorations/dto/pagination.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
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

    const createdStudent = new this.studentModel(createStudentDto);
    return createdStudent.save();
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

    const existingStudentIds = new Set(
      existingStudents.map((s) => s.studentId),
    );

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
        }

        // Create new student
        const createdStudent = new this.studentModel(dto);
        const savedStudent = await createdStudent.save();
        results.success.push(savedStudent);

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
      email,
      phone,
      address,
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

    if (email) {
      query.email = { $regex: email, $options: 'i' };
    }

    if (phone) {
      query.phone = { $regex: phone, $options: 'i' };
    }

    if (address) {
      query.address = { $regex: address, $options: 'i' };
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
    }

    // Execute query with pagination
    const data = await this.studentModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
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

  async findById(id: string): Promise<Student> {
    const student = await this.studentModel.findById(id).exec();
    if (!student) {
      throw new NotFoundException(`Sinh viên với ID "${id}" không tìm thấy`);
    }
    return student;
  }

  async findByStudentId(studentId: string): Promise<Student> {
    const student = await this.studentModel.findOne({ studentId }).exec();
    if (!student) {
      throw new NotFoundException(
        `Sinh viên với mã "${studentId}" không tìm thấy`,
      );
    }
    return student;
  }

  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
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
    }

    // Add updated date
    const updatedData = {
      ...updateStudentDto,
      updatedAt: new Date(),
    };

    const updatedStudent = await this.studentModel
      .findByIdAndUpdate(id, updatedData, { new: true })
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
        const deletedStudent = await this.studentModel
          .findByIdAndDelete(id)
          .exec();

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
  async batchUpdate(
    updates: { id: string; data: UpdateStudentDto }[],
  ): Promise<{
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
        }

        // Add updated date
        const updatedData = {
          ...update.data,
          updatedAt: new Date(),
        };

        const updatedStudent = await this.studentModel
          .findByIdAndUpdate(update.id, updatedData, { new: true })
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
}
