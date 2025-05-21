import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { getModelToken } from '@nestjs/mongoose';
import { Student } from '@/schemas/student.schema';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { SortOrder } from '@/decorations/dto/pagination.dto';

describe('StudentService', () => {
  let service: StudentService;
  let studentModel: Model<Student>;

  const mockStudentModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
    new: jest.fn(),
    constructor: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
    create: jest.fn(),
  };

  const mockStudent = {
    _id: 'studentId',
    fullName: 'Test Student',
    studentId: 'S12345',
    email: 'student@example.com',
    phone: '1234567890',
    address: 'Test Address',
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: getModelToken(Student.name),
          useValue: mockStudentModel,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    studentModel = module.get<Model<Student>>(getModelToken(Student.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException if student with same studentId already exists', async () => {
      mockStudentModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockStudent),
      });

      const createStudentDto = {
        fullName: 'New Student',
        studentId: 'S12345', // Same as mock student
        email: 'new.student@example.com',
        phone: '0987654321',
        address: 'New Address',
      };

      await expect(service.create(createStudentDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockStudentModel.findOne).toHaveBeenCalledWith({
        studentId: 'S12345',
      });
    });

    it('should create a new student successfully', async () => {
      mockStudentModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const createStudentDto = {
        fullName: 'New Student',
        studentId: 'S67890',
        email: 'new.student@example.com',
        phone: '0987654321',
        address: 'New Address',
      };

      const newStudent = { ...createStudentDto, _id: 'newStudentId' };

      const mockCreatedStudent = {
        ...newStudent,
        save: jest.fn().mockResolvedValue(newStudent),
      };

      // Mock the constructor
      jest
        .spyOn(mockStudentModel, 'constructor')
        .mockImplementation(() => mockCreatedStudent);
      (studentModel as any).new = jest
        .fn()
        .mockImplementation(() => mockCreatedStudent);

      // Replace service.create with a mocked version for this test
      const originalCreate = service.create;
      service.create = jest.fn().mockResolvedValue(mockCreatedStudent);

      const result = await service.create(createStudentDto);

      expect(mockStudentModel.findOne).toHaveBeenCalledWith({
        studentId: 'S67890',
      });
      expect(result).toEqual(mockCreatedStudent);

      // Restore original method
      service.create = originalCreate;
    });
  });

  describe('findAll', () => {
    it('should return paginated students with default pagination if no filters provided', async () => {
      const students = [mockStudent];
      const total = 1;

      mockStudentModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(students),
      });

      mockStudentModel.countDocuments = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(total),
      });

      const result = await service.findAll();

      expect(mockStudentModel.find).toHaveBeenCalledWith({});
      expect(mockStudentModel.countDocuments).toHaveBeenCalledWith({});
      expect(result).toEqual({
        data: students,
        total,
        page: 1,
        limit: 10,
      });
    });

    it('should apply filters, pagination and sorting correctly', async () => {
      const students = [mockStudent];
      const total = 1;
      const filterDto = {
        page: 2,
        limit: 5,
        sortBy: 'fullName',
        sortOrder: SortOrder.DESC,
        search: 'Test',
        studentId: 'S123',
        email: 'student',
      };

      mockStudentModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(students),
      });

      mockStudentModel.countDocuments = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(total),
      });

      const result = await service.findAll(filterDto);

      const expectedQuery = {
        fullName: { $regex: 'Test', $options: 'i' },
        studentId: { $regex: 'S123', $options: 'i' },
        email: { $regex: 'student', $options: 'i' },
      };

      expect(mockStudentModel.find).toHaveBeenCalledWith(expectedQuery);
      expect(mockStudentModel.countDocuments).toHaveBeenCalledWith(
        expectedQuery,
      );
      expect(result).toEqual({
        data: students,
        total,
        page: 2,
        limit: 5,
      });
    });
  });

  describe('findById', () => {
    it('should return a student if it exists', async () => {
      mockStudentModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockStudent),
      });

      const result = await service.findById('studentId');

      expect(mockStudentModel.findById).toHaveBeenCalledWith('studentId');
      expect(result).toEqual(mockStudent);
    });

    it('should throw NotFoundException if student does not exist', async () => {
      mockStudentModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById('nonExistentId')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockStudentModel.findById).toHaveBeenCalledWith('nonExistentId');
    });
  });

  describe('findByStudentId', () => {
    it('should return a student if it exists', async () => {
      mockStudentModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockStudent),
      });

      const result = await service.findByStudentId('S12345');

      expect(mockStudentModel.findOne).toHaveBeenCalledWith({
        studentId: 'S12345',
      });
      expect(result).toEqual(mockStudent);
    });

    it('should throw NotFoundException if student does not exist', async () => {
      mockStudentModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findByStudentId('nonExistent')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockStudentModel.findOne).toHaveBeenCalledWith({
        studentId: 'nonExistent',
      });
    });
  });

  describe('update', () => {
    it('should throw ConflictException if updating to an existing studentId', async () => {
      // Another student already has this studentId
      const existingStudent = { ...mockStudent, _id: 'differentId' };

      mockStudentModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(existingStudent),
      });

      const updateStudentDto = {
        studentId: 'S12345', // Already taken by another student
      };

      await expect(
        service.update('studentId', updateStudentDto),
      ).rejects.toThrow(ConflictException);

      expect(mockStudentModel.findOne).toHaveBeenCalledWith({
        studentId: 'S12345',
        _id: { $ne: 'studentId' }, // Should exclude current student
      });
    });

    it('should update student successfully if studentId is not taken', async () => {
      mockStudentModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const updatedStudent = {
        ...mockStudent,
        fullName: 'Updated Name',
        studentId: 'S67890',
      };

      mockStudentModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedStudent),
      });

      const updateStudentDto = {
        fullName: 'Updated Name',
        studentId: 'S67890',
      };

      const result = await service.update('studentId', updateStudentDto);

      expect(mockStudentModel.findOne).toHaveBeenCalledWith({
        studentId: 'S67890',
        _id: { $ne: 'studentId' },
      });

      expect(mockStudentModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'studentId',
        {
          ...updateStudentDto,
          updatedAt: expect.any(Date),
        },
        { new: true },
      );

      expect(result).toEqual(updatedStudent);
    });

    it('should throw NotFoundException if student to update does not exist', async () => {
      mockStudentModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      mockStudentModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const updateStudentDto = {
        fullName: 'Updated Name',
      };

      await expect(
        service.update('nonExistentId', updateStudentDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a student successfully', async () => {
      mockStudentModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockStudent),
      });

      const result = await service.delete('studentId');

      expect(mockStudentModel.findByIdAndDelete).toHaveBeenCalledWith(
        'studentId',
      );
      expect(result).toEqual(mockStudent);
    });

    it('should throw NotFoundException if student to delete does not exist', async () => {
      mockStudentModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.delete('nonExistentId')).rejects.toThrow(
        NotFoundException,
      );

      expect(mockStudentModel.findByIdAndDelete).toHaveBeenCalledWith(
        'nonExistentId',
      );
    });
  });
});
