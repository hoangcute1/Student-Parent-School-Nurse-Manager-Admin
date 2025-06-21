import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@/schemas/user.schema';
import { ProfileService } from './profile.service';
import { AdminService } from './admin.service';
import { StaffService } from './staff.service';
import { ParentService } from './parent.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '@/decorations/dto/create-user.dto';
import { UpdateUserDto } from '@/decorations/dto/update-user.dto';
import { CreateUserAdminDto } from '@/decorations/dto/create-user-admin.dto';
import { CreateUserParentDto } from '@/decorations/dto/create-user-parent.dto';
import { CreateUserStaffDto } from '@/decorations/dto/create-user-staff.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private profileService: ProfileService,
    private adminService: AdminService,
    @Inject(forwardRef(() => StaffService))
    private staffService: StaffService,
    @Inject(forwardRef(() => ParentService))
    private parentService: ParentService,
  ) {}

  async findAll(): Promise<
    {
      _id: any;
      email: string;
      createdAt: Date;
      updatedAt: Date;
    }[]
  > {
    const users = await this.userModel.find().exec();
    return users.map((user) => {
      return {
        _id: user._id,
        email: user.email,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      };
    });
  }

  async findById(id: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException(`User với ID "${id}" không tìm thấy`);
      }
      return user;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }
      throw error;
    }
  }

  async findByIdWithRole(user: string): Promise<UserDocument | null> {
    return this.userModel.findById(user).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByEmailWithRole(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByRefreshToken(refreshToken: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ refresh_token: refreshToken }).exec();
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(
        id,
        {
          refreshToken,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  async updateRole(id: string, roleName: string): Promise<User> {
    // Verify user exists
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User với ID "${id}" không tìm thấy`);
    }

    try {
      // Find the role by name

      // Update user's role
      user.updated_at = new Date();

      return user.save();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Vai trò "${roleName}" không tìm thấy`);
      }
      throw error;
    }
  }
  async deleteById(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async getUserProfile(user_id: string) {
    const user = await this.findById(user_id);

    const profile = await this.profileService.findByuser(user_id);
    return { user, profile };
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email đã tồn tại');
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return createdUser.save();
  }

  async updateById(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User với ID "${id}" không tìm thấy`);
    }
    // If password is being updated, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    Object.assign(user, updateUserDto, { updated_at: new Date() });
    return user.save();
  }
  /**
   * Find all users who are admins
   * @returns List of admin users
   */
  async findAllAdmins(): Promise<any[]> {
    const admins = await this.adminService.findAll();
    const adminUsers: any[] = [];

    for (const admin of admins) {
      const user = admin.user as any;
      if (user && user._id) {
        adminUsers.push({
          _id: user._id,
          email: user.email,
          adminId: admin._id,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        });
      }
    }

    return adminUsers;
  }

  /**
   * Find all users who are parents
   * @returns List of parent users
   */
  async findAllParents(): Promise<any[]> {
    const parents = await this.parentService.findAll();
    const parentUsers: any[] = [];

    for (const parent of parents) {
      const user = parent.user;
      if (user && user._id) {
        parentUsers.push({
          _id: user._id,
          email: user.email,
          parentId: parent._id,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        });
      }
    }

    return parentUsers;
  }

  /**
   * Find all users who are staff
   * @returns List of staff users
   */
  async findAllStaff(): Promise<any[]> {
    const staffList = await this.staffService.findAll();
    const staffUsers: any[] = [];

    for (const staff of staffList) {
      const user = staff.user as any;
      if (user && user._id) {
        staffUsers.push({
          _id: user._id,
          email: user.email,
          staffId: staff._id,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        });
      }
    }

    return staffUsers;
  } /**
   * Create a new admin user
   * @param createUserAdminDto DTO containing admin user data
   * @returns The created admin user with admin document
   */
  async createAdmin(createUserAdminDto: CreateUserAdminDto): Promise<any> {
    // First create the user
    const createdUser = await this.create({
      email: createUserAdminDto.email,
      password: createUserAdminDto.password,
    });

    // Then create the admin record with the user's ID
    const createdAdmin = await this.adminService.create({
      user: createdUser['_id'],
    });

    return {
      user: {
        _id: createdUser['_id'],
        email: createdUser.email,
        created_at: createdUser.created_at,
        updated_at: createdUser.updated_at,
      },
      admin: createdAdmin,
    };
  }

  /**
   * Create a new parent user
   * @param createUserParentDto DTO containing parent user data
   * @returns The created parent user with parent document
   */
  async createParent(createUserParentDto: CreateUserParentDto): Promise<any> {
    // First create the user
    const createdUser = await this.create({
      email: createUserParentDto.email,
      password: createUserParentDto.password,
    });

    // Then create the parent record with the user's ID
    const createdParent = await this.parentService.create({
      user: createdUser['_id'],
    });

    return {
      user: {
        _id: createdUser['_id'],
        email: createdUser.email,
        created_at: createdUser.created_at,
        updated_at: createdUser.updated_at,
      },
      parent: createdParent,
    };
  }

  /**
   * Create a new staff user
   * @param createUserStaffDto DTO containing staff user data
   * @returns The created staff user with staff document
   */ async createStaff(createUserStaffDto: CreateUserStaffDto): Promise<any> {
    // First create the user
    const createdUser = await this.create({
      email: createUserStaffDto.email,
      password: createUserStaffDto.password,
    });

    // Then create the staff record with the user's ID
    const createdStaff = await this.staffService.create({
      user: createdUser['_id'],
    });

    return {
      user: {
        _id: createdUser['_id'],
        email: createdUser.email,
        created_at: createdUser.created_at,
        updated_at: createdUser.updated_at,
      },
      staff: createdStaff,
    };
  }
}
