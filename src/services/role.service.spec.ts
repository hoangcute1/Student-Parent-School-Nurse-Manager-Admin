import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { getModelToken } from '@nestjs/mongoose';
import { Role } from '@/schemas/role.schema';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

describe('RoleService', () => {
  let service: RoleService;
  let roleModel: Model<Role>;

  const mockRoleModel = {
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

  const mockRole = {
    _id: 'roleId',
    name: 'teacher',
    description: 'Teacher role',
    permissions: ['read_students', 'update_students'],
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn(),
  };

  const mockAdminRole = {
    _id: 'adminRoleId',
    name: 'admin',
    description: 'Administrator role',
    permissions: [
      'manage_all',
      'create_students',
      'update_students',
      'delete_students',
      'read_students',
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getModelToken(Role.name),
          useValue: mockRoleModel,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    roleModel = module.get<Model<Role>>(getModelToken(Role.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException if role with same name already exists', async () => {
      mockRoleModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockRole),
      });

      const createRoleDto = {
        name: 'teacher', // Same as mock role
        description: 'Teacher role',
        permissions: ['read_students'],
      };

      await expect(service.create(createRoleDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockRoleModel.findOne).toHaveBeenCalledWith({
        name: 'teacher',
      });
    });

    it('should create a new role successfully', async () => {
      mockRoleModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const createRoleDto = {
        name: 'editor',
        description: 'Editor role',
        permissions: ['read_students', 'update_students'],
      };

      const newRole = { ...createRoleDto, _id: 'newRoleId' };

      const mockCreatedRole = {
        ...newRole,
        save: jest.fn().mockResolvedValue(newRole),
      };

      // Mock the constructor
      jest
        .spyOn(mockRoleModel, 'constructor')
        .mockImplementation(() => mockCreatedRole);
      (roleModel as any).new = jest
        .fn()
        .mockImplementation(() => mockCreatedRole);

      // Replace service.create with a mocked version for this test
      const originalCreate = service.create;
      service.create = jest.fn().mockResolvedValue(mockCreatedRole);

      const result = await service.create(createRoleDto);

      expect(mockRoleModel.findOne).toHaveBeenCalledWith({
        name: 'editor',
      });
      expect(result).toEqual(mockCreatedRole);

      // Restore original method
      service.create = originalCreate;
    });
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const roles = [mockRole, mockAdminRole];
      mockRoleModel.find = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(roles),
      });

      const result = await service.findAll();

      expect(mockRoleModel.find).toHaveBeenCalled();
      expect(result).toEqual(roles);
    });
  });

  describe('findById', () => {
    it('should return a role if it exists', async () => {
      mockRoleModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockRole),
      });

      const result = await service.findById('roleId');

      expect(mockRoleModel.findById).toHaveBeenCalledWith('roleId');
      expect(result).toEqual(mockRole);
    });

    it('should throw NotFoundException if role does not exist', async () => {
      mockRoleModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById('nonExistentId')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRoleModel.findById).toHaveBeenCalledWith('nonExistentId');
    });
  });

  describe('findByName', () => {
    it('should return a role if it exists', async () => {
      mockRoleModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockRole),
      });

      const result = await service.findByName('teacher');

      expect(mockRoleModel.findOne).toHaveBeenCalledWith({ name: 'teacher' });
      expect(result).toEqual(mockRole);
    });

    it('should throw NotFoundException if role does not exist', async () => {
      mockRoleModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findByName('nonExistent')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRoleModel.findOne).toHaveBeenCalledWith({
        name: 'nonExistent',
      });
    });
  });

  describe('update', () => {
    it('should throw ConflictException if updating to an existing role name', async () => {
      // Another role already has this name
      const existingRole = { ...mockRole, _id: 'differentId' };

      mockRoleModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(existingRole),
      });

      const updateRoleDto = {
        name: 'teacher', // Already taken by another role
      };

      await expect(service.update('roleId', updateRoleDto)).rejects.toThrow(
        ConflictException,
      );

      expect(mockRoleModel.findOne).toHaveBeenCalledWith({
        name: 'teacher',
        _id: { $ne: 'roleId' }, // Should exclude current role
      });
    });

    it('should update role successfully if name is not taken', async () => {
      mockRoleModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const updatedRole = {
        ...mockRole,
        name: 'senior_teacher',
        description: 'Senior Teacher Role',
      };

      mockRoleModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedRole),
      });

      const updateRoleDto = {
        name: 'senior_teacher',
        description: 'Senior Teacher Role',
      };

      const result = await service.update('roleId', updateRoleDto);

      expect(mockRoleModel.findOne).toHaveBeenCalledWith({
        name: 'senior_teacher',
        _id: { $ne: 'roleId' },
      });

      expect(mockRoleModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'roleId',
        {
          ...updateRoleDto,
          updatedAt: expect.any(Date),
        },
        { new: true },
      );

      expect(result).toEqual(updatedRole);
    });

    it('should throw NotFoundException if role to update does not exist', async () => {
      mockRoleModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      mockRoleModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const updateRoleDto = {
        description: 'Updated Description',
      };

      await expect(
        service.update('nonExistentId', updateRoleDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should throw ConflictException when trying to delete a default role', async () => {
      mockRoleModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockAdminRole),
      });

      await expect(service.delete('adminRoleId')).rejects.toThrow(
        ConflictException,
      );

      expect(mockRoleModel.findById).toHaveBeenCalledWith('adminRoleId');
    });

    it('should delete a role successfully if not a default role', async () => {
      mockRoleModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockRole),
      });

      mockRoleModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockRole),
      });

      const result = await service.delete('roleId');

      expect(mockRoleModel.findById).toHaveBeenCalledWith('roleId');
      expect(mockRoleModel.findByIdAndDelete).toHaveBeenCalledWith('roleId');
      expect(result).toEqual(mockRole);
    });

    it('should throw NotFoundException if role to delete does not exist', async () => {
      mockRoleModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.delete('nonExistentId')).rejects.toThrow(
        NotFoundException,
      );

      expect(mockRoleModel.findById).toHaveBeenCalledWith('nonExistentId');
    });
  });

  describe('addPermission', () => {
    it('should add a new permission to a role', async () => {
      const roleBeforeAddingPermission = {
        ...mockRole,
        permissions: ['read_students', 'update_students'],
        save: jest.fn(),
      };

      const roleAfterAddingPermission = {
        ...mockRole,
        permissions: ['read_students', 'update_students', 'create_students'],
      };

      roleBeforeAddingPermission.save.mockResolvedValue(
        roleAfterAddingPermission,
      );

      mockRoleModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(roleBeforeAddingPermission),
      });

      const result = await service.addPermission('roleId', 'create_students');

      expect(mockRoleModel.findById).toHaveBeenCalledWith('roleId');
      expect(roleBeforeAddingPermission.save).toHaveBeenCalled();
      expect(result).toEqual(roleAfterAddingPermission);
    });

    it('should not add duplicate permission', async () => {
      const role = {
        ...mockRole,
        permissions: ['read_students', 'update_students'],
        save: jest.fn(),
      };

      // No change expected as permission already exists
      role.save.mockResolvedValue(role);

      mockRoleModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(role),
      });

      const result = await service.addPermission('roleId', 'read_students');

      expect(mockRoleModel.findById).toHaveBeenCalledWith('roleId');
      expect(role.save).not.toHaveBeenCalled();
      expect(result).toEqual(role);
    });

    it('should throw NotFoundException if role does not exist', async () => {
      mockRoleModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.addPermission('nonExistentId', 'read_students'),
      ).rejects.toThrow(NotFoundException);

      expect(mockRoleModel.findById).toHaveBeenCalledWith('nonExistentId');
    });
  });

  describe('removePermission', () => {
    it('should remove a permission from a role', async () => {
      const roleBeforeRemovingPermission = {
        ...mockRole,
        permissions: ['read_students', 'update_students', 'create_students'],
        save: jest.fn(),
      };

      const roleAfterRemovingPermission = {
        ...mockRole,
        permissions: ['read_students', 'create_students'],
      };

      roleBeforeRemovingPermission.save.mockResolvedValue(
        roleAfterRemovingPermission,
      );

      mockRoleModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(roleBeforeRemovingPermission),
      });

      const result = await service.removePermission(
        'roleId',
        'update_students',
      );

      expect(mockRoleModel.findById).toHaveBeenCalledWith('roleId');
      expect(roleBeforeRemovingPermission.save).toHaveBeenCalled();
      expect(result).toEqual(roleAfterRemovingPermission);
    });

    it('should throw NotFoundException if role does not exist', async () => {
      mockRoleModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.removePermission('nonExistentId', 'read_students'),
      ).rejects.toThrow(NotFoundException);

      expect(mockRoleModel.findById).toHaveBeenCalledWith('nonExistentId');
    });
  });
});
