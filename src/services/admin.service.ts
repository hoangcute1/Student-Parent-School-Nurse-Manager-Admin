import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from '@/schemas/admin.schema';
import { CreateAdminDto } from '@/decorations/dto/create-admin.dto';
import { UpdateAdminDto } from '@/decorations/dto/update-admin.dto';

/**
 * Service for managing admin records
 * The Admin schema only contains a reference to a User document
 */
@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
  ) {}

  /**
   * Create a new admin record
   * @param createAdminDto DTO containing userId that will be mapped to user field
   * @returns The created admin document
   */
  async create(createAdminDto: CreateAdminDto): Promise<AdminDocument> {
    // Check if admin with this user already exists
    const existingAdmin = await this.adminModel
      .findOne({ user: createAdminDto.userId })
      .exec();

    if (existingAdmin) {
      throw new ConflictException('Admin for this user already exists');
    }

    const createdAdmin = new this.adminModel({
      user: createAdminDto.userId, // Map userId from DTO to user in schema
    });
    return createdAdmin.save();
  }

  /**
   * Find all admin records
   * @returns Array of admin documents with populated user references
   */
  async findAll(): Promise<AdminDocument[]> {
    return this.adminModel.find().populate('user').exec();
  }

  /**
   * Find an admin by ID
   * @param id Admin document ID
   * @returns Admin document with populated user reference
   */
  async findById(id: string): Promise<AdminDocument> {
    const admin = await this.adminModel.findById(id).populate('user').exec();
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return admin;
  }

  async validateAdmin(userId: string): Promise<AdminDocument | null> {
    return this.findByUserId(userId);
  }

  async findByUserId(userId: string): Promise<AdminDocument | null> {
    console.log('Finding admin by userId:', userId);
    return this.adminModel.findOne({ user: userId }).exec();
  }

  /**
   * Update an admin record
   * @param id Admin document ID
   * @param updateAdminDto DTO containing fields to update
   * @returns Updated admin document
   */
  async update(
    id: string,
    updateAdminDto: UpdateAdminDto,
  ): Promise<AdminDocument> {
    const updateData = { ...updateAdminDto };

    // Map userId to user field if provided
    if (updateAdminDto.userId) {
      updateData['user'] = updateAdminDto.userId;
      delete updateData['userId'];
    }

    const updatedAdmin = await this.adminModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('user')
      .exec();

    if (!updatedAdmin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return updatedAdmin;
  }

  /**
   * Remove an admin record
   * @param id Admin document ID
   * @returns The deleted admin document
   */
  async remove(id: string): Promise<AdminDocument> {
    const deletedAdmin = await this.adminModel.findByIdAndDelete(id).exec();
    if (!deletedAdmin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return deletedAdmin;
  }

  /**
   * Validate if user is an admin
   * @param userId The user ID to check
   * @returns The admin document if valid, null otherwise
   */
}
