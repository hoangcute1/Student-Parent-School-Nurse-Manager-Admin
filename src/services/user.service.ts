import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@/schemas/user.schema';
import { RoleService } from './role.service';
import { ProfileService } from './profile.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private roleService: RoleService,
    private profileService: ProfileService,
  ) {}

  async create(email: string, password: string, role?: string): Promise<User> {
    // Check if user with this email already exists
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('Email đã tồn tại');
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const foundRole = role ? await this.roleService.findByName(role) : null;
      const createdUser = new this.userModel({
        email,
        password: hashedPassword,
        roleId: foundRole ? foundRole._id : null,
      });
      return createdUser.save();
    } catch (error) {
      // If role not found, fallback to creating without role reference
      if (error instanceof NotFoundException) {
        const createdUser = new this.userModel({
          email,
          password,
        });
        return createdUser.save();
      }
      throw error;
    }
  }

  async findAll(): Promise<
    {
      id: any;
      email: string;
      role: string | null;
      createdAt: Date;
      updatedAt: Date;
    }[]
  > {
    const users = await this.userModel.find().populate('roleId').exec();

    return users.map((user) => {
      return {
        id: user._id,
        email: user.email,
        role:
          user.roleId &&
          typeof user.roleId === 'object' &&
          'name' in user.roleId
            ? (user.roleId as any).name
            : null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });
  }

  async findById(id: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findById(id).populate('roleId').exec();
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

  async findByIdWithRole(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId).populate('roleId').exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).populate('roleId').exec();
  }

  async findByEmailWithRole(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).populate('roleId').exec();
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<User | null> {
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
      const role = await this.roleService.findByName(roleName);

      // Update user's role
      user.roleId = role.id as any;
      user.updatedAt = new Date();

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

  async getUserProfile(userId: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const profile = await this.profileService.findByUserId(userId);
    return { user, profile };
  }
}
