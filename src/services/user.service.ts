import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
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
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private profileService: ProfileService,
    private adminService: AdminService,
    private staffService: StaffService,
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
    return this.userModel
      .findOne({ refresh_token: refreshToken })
      .exec();
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
    if (!user) {
      throw new NotFoundException(`User with ID ${user} not found`);
    }

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
}
