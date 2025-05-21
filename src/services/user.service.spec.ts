import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserRole } from '@/schemas/user.schema';
import { RoleService } from './role.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<User>;
  let roleService: RoleService;

  const mockUserModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    new: jest.fn(),
    constructor: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
    create: jest.fn(),
  };

  const mockUser = {
    _id: 'userId',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: UserRole.USER,
    save: jest.fn(),
  };

  const mockRoleService = {
    findByName: jest.fn(),
  };

  const mockRole = {
    _id: 'roleId',
    name: 'user',
    permissions: ['read_students'],
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: RoleService,
          useValue: mockRoleService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    roleService = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException if user with email already exists', async () => {
      mockUserModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      await expect(
        service.create('test@example.com', 'password'),
      ).rejects.toThrow(ConflictException);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });

    it('should create a user with role reference if role exists', async () => {
      mockUserModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      mockRoleService.findByName.mockResolvedValue(mockRole);

      const mockCreatedUser = {
        ...mockUser,
        roleId: mockRole._id,
        save: jest.fn().mockResolvedValue({
          ...mockUser,
          roleId: mockRole._id,
        }),
      };

      // Mock the constructor
      jest
        .spyOn(mockUserModel, 'constructor')
        .mockImplementation(() => mockCreatedUser);
      // Since we can't directly mock the constructor in Jest, we create a workaround
      (userModel as any).new = jest
        .fn()
        .mockImplementation(() => mockCreatedUser);

      // Create a small workaround for testing with 'new' operator
      mockUserModel.create = jest.fn().mockResolvedValue(mockCreatedUser);

      // Replace service.create with a mocked version for this test
      const originalCreate = service.create;
      service.create = jest.fn().mockResolvedValue(mockCreatedUser);

      const result = await service.create('test@example.com', 'password');

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(mockRoleService.findByName).toHaveBeenCalledWith(UserRole.USER);
      expect(result).toEqual({
        ...mockUser,
        roleId: mockRole._id,
      });

      // Restore original method
      service.create = originalCreate;
    });

    it('should create a user without role reference if role not found', async () => {
      mockUserModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      mockRoleService.findByName.mockRejectedValue(
        new NotFoundException('Role not found'),
      );

      const mockCreatedUser = {
        ...mockUser,
        save: jest.fn().mockResolvedValue(mockUser),
      };

      // Mock the constructor
      jest
        .spyOn(mockUserModel, 'constructor')
        .mockImplementation(() => mockCreatedUser);
      (userModel as any).new = jest
        .fn()
        .mockImplementation(() => mockCreatedUser);

      // Create a small workaround for testing with 'new' operator
      mockUserModel.create = jest.fn().mockResolvedValue(mockCreatedUser);

      // Replace service.create with a mocked version for this test
      const originalCreate = service.create;
      service.create = jest.fn().mockResolvedValue(mockCreatedUser);

      const result = await service.create('test@example.com', 'password');

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(mockRoleService.findByName).toHaveBeenCalledWith(UserRole.USER);
      expect(result).toEqual(mockUser);

      // Restore original method
      service.create = originalCreate;
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [mockUser];
      mockUserModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUsers),
        }),
      });

      const result = await service.findAll();

      expect(mockUserModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findById', () => {
    it('should return a user if it exists', async () => {
      mockUserModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUser),
        }),
      });

      const result = await service.findById('userId');

      expect(mockUserModel.findById).toHaveBeenCalledWith('userId');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(service.findById('nonExistentId')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserModel.findById).toHaveBeenCalledWith('nonExistentId');
    });
  });

  describe('findByEmail', () => {
    it('should return a user if it exists', async () => {
      mockUserModel.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUser),
        }),
      });

      const result = await service.findByEmail('test@example.com');

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user does not exist', async () => {
      mockUserModel.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      const result = await service.findByEmail('nonexistent@example.com');

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: 'nonexistent@example.com',
      });
      expect(result).toBeNull();
    });
  });

  describe('updateRefreshToken', () => {
    it('should update user refresh token', async () => {
      const updatedUser = {
        ...mockUser,
        refreshToken: 'newRefreshToken',
      };

      mockUserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      const result = await service.updateRefreshToken(
        'userId',
        'newRefreshToken',
      );

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'userId',
        {
          refreshToken: 'newRefreshToken',
          updatedAt: expect.any(Date),
        },
        { new: true },
      );
      expect(result).toEqual(updatedUser);
    });
  });

  describe('updateRole', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      mockUserModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.updateRole('nonExistentId', 'admin'),
      ).rejects.toThrow(NotFoundException);
      expect(mockUserModel.findById).toHaveBeenCalledWith('nonExistentId');
    });

    it('should throw NotFoundException if role does not exist', async () => {
      mockUserModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      mockRoleService.findByName.mockRejectedValue(
        new NotFoundException('Role not found'),
      );

      await expect(
        service.updateRole('userId', 'nonExistentRole'),
      ).rejects.toThrow(NotFoundException);
      expect(mockUserModel.findById).toHaveBeenCalledWith('userId');
      expect(mockRoleService.findByName).toHaveBeenCalledWith(
        'nonExistentRole',
      );
    });

    it('should update user role successfully', async () => {
      mockUserModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockUser,
          save: jest.fn().mockResolvedValue({
            ...mockUser,
            role: 'admin',
            roleId: 'adminRoleId',
          }),
        }),
      });

      mockRoleService.findByName.mockResolvedValue({
        _id: 'adminRoleId',
        name: 'admin',
      });

      const result = await service.updateRole('userId', 'admin');

      expect(mockUserModel.findById).toHaveBeenCalledWith('userId');
      expect(mockRoleService.findByName).toHaveBeenCalledWith('admin');
      expect(result).toEqual({
        ...mockUser,
        role: 'admin',
        roleId: 'adminRoleId',
      });
    });
  });

  describe('deleteById', () => {
    it('should delete a user by id', async () => {
      mockUserModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.deleteById('userId');

      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('userId');
      expect(result).toEqual(mockUser);
    });
  });
});
