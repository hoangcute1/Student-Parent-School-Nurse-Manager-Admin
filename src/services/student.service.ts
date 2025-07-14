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
import { ClassService } from './class.service';
import { UserDocument } from '@/schemas/user.schema';
import { ParentStudentService } from './parent-student.service';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    private parentService: ParentService,
    private healthRecordService: HealthRecordService,
    private classService: ClassService,
    @InjectModel('User') private userModel: Model<UserDocument>,
    private parentStudentService: ParentStudentService,
  ) {}
  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    try {
      // Check if student already exists
      const existingStudent = await this.studentModel
        .findOne({ studentId: createStudentDto.studentId })
        .exec();

      if (existingStudent) {
        throw new ConflictException(`Mã sinh viên ${createStudentDto.studentId} đã tồn tại`);
      }

      // Find class by name
      const classDoc = await this.classService.findByName(createStudentDto.class);
      if (!classDoc) {
        throw new NotFoundException(`Không tìm thấy lớp ${createStudentDto.class}`);
      }

      // Find or create parent by email
      let parent: any;
      const existingUser = await this.userModel.findOne({
        email: createStudentDto.parentEmail,
        //  role: 'parent'
      });

      if (!existingUser) {
        throw new NotFoundException(
          `Không tìm thấy phụ huynh với email ${createStudentDto.parentEmail}`,
        );
      }

      parent = await this.parentService.findByUserId(existingUser._id as string);
      if (!parent) {
        // Create parent profile if user exists but doesn't have parent profile
        try {
          parent = await this.parentService.create({
            user: existingUser._id as string,
            // name: `Phụ huynh của ${createStudentDto.name}`
          });

          if (!parent) {
            throw new BadRequestException('Không thể tạo thông tin phụ huynh');
          }
        } catch (error) {
          throw new BadRequestException(`Lỗi khi tạo thông tin phụ huynh: ${error.message}`);
        }
      }
      // Create student with resolved references
      const studentData = {
        name: createStudentDto.name,
        studentId: createStudentDto.studentId,
        birth: createStudentDto.birth,
        gender: createStudentDto.gender,
        class: classDoc._id,
        parent: parent._id,
      };

      const createdStudent = new this.studentModel(studentData);
      const savedStudent = await createdStudent.save();

      // Return populated student data
      const student = await this.studentModel
        .findById(savedStudent._id)
        .populate('parent')
        .populate('class')
        .exec();

      if (!student) {
        throw new InternalServerErrorException('Không tìm thấy học sinh sau khi tạo');
      }

      const studentIdStr = savedStudent._id?.toString();
      if (!studentIdStr) {
        throw new InternalServerErrorException('Không lấy được studentId sau khi tạo student');
      }
      // Tạo liên kết parent-student
      try {
        await this.parentStudentService.create({
          parent: parent._id.toString(),
          student: studentIdStr,
        });
      } catch (err) {
        // Nếu lỗi, rollback student
        await this.studentModel.findByIdAndDelete(savedStudent._id);
        throw new InternalServerErrorException(
          'Lỗi khi tạo liên kết parent-student: ' + err.message,
        );
      }

      // Tạo healthRecord cho student
      try {
        await this.healthRecordService.create({
          student_id: studentIdStr,
        });
      } catch (err) {
        // Nếu lỗi, rollback parent-student và student
        await this.parentStudentService.removeByStudentId(studentIdStr);
        await this.studentModel.findByIdAndDelete(savedStudent._id);
        throw new InternalServerErrorException('Lỗi khi tạo health record: ' + err.message);
      }

      return student;
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Có lỗi xảy ra khi tạo học sinh: ' + error.message);
    }
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
    // Xóa parent-student và healthRecord trước khi xóa student
    await this.parentStudentService.removeByStudentId(id);
    await this.healthRecordService.removeByStudentId(id);
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
        // Xóa parent-student và healthRecord trước khi xóa student
        await this.parentStudentService.removeByStudentId(id);
        await this.healthRecordService.removeByStudentId(id);
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

  async findByGradeLevel(gradeLevel: number) {
    try {
      // Logic để tìm học sinh theo khối học
      // Giả sử khối học được xác định bởi ký tự đầu trong tên lớp
      const gradePattern = new RegExp(`^${gradeLevel}`, 'i');

      const classes = await this.classService.findByGradeLevel(gradeLevel);
      const classIds = classes.map((cls) => cls._id);

      const students = await this.studentModel
        .find({ class: { $in: classIds } })
        .populate('class', 'name')
        .populate('parent', 'name email')
        .exec();

      return students.map((student) => formatStudentResponse(student));
    } catch (error) {
      console.error('Error finding students by grade level:', error);
      throw new InternalServerErrorException('Không thể tìm học sinh theo khối học');
    }
  }

  async searchStudents(query: string) {
    try {
      if (!query || query.trim().length < 2) {
        return [];
      }

      const searchRegex = new RegExp(query, 'i');

      const students = await this.studentModel
        .find({
          $or: [{ name: searchRegex }, { studentId: searchRegex }],
        })
        .populate('class', 'name')
        .limit(20)
        .exec();

      return students.map((student) => ({
        _id: student._id,
        name: student.name,
        student_code: student.studentId,
        class_name: (student.class as any)?.name || 'N/A',
      }));
    } catch (error) {
      console.error('Error searching students:', error);
      throw new InternalServerErrorException('Không thể tìm kiếm học sinh');
    }
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
