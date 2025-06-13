import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from '@/schemas/admin.schema';
import { CreateAdminDto } from '@/decorations/dto/create-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async findAll(): Promise<Admin[]> {
    return this.adminModel.find().populate('user').exec();
  }

  async findById(id: string): Promise<Admin> {
    const admin = await this.adminModel.findById(id).populate('user').exec();
    if (!admin) {
      throw new NotFoundException(`Admin with ID "${id}" not found`);
    }
    return admin;
  }

  async findByUserId(userId: string): Promise<Admin | null> {
    return this.adminModel.findOne({ userId }).exec();
  }

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    // Check if admin with this userId already exists
    const existingAdmin = await this.adminModel
      .findOne({ userId: createAdminDto.userId })
      .exec();

    if (existingAdmin) {
      throw new ConflictException('An admin with this user ID already exists');
    }

    const createdAdmin = new this.adminModel(createAdminDto);
    return createdAdmin.save();
  }

  async remove(id: string): Promise<any> {
    const deletedAdmin = await this.adminModel.findByIdAndDelete(id).exec();
    if (!deletedAdmin) {
      throw new NotFoundException(`Admin with ID "${id}" not found`);
    }
    return { id, deleted: true };
  }
}
