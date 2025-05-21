import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from '@/schemas/role.schema';
import { CreateRoleDto } from '@/decorations/dto/create-role.dto';
import { UpdateRoleDto } from '@/decorations/dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {
    // Initialize default roles if none exist
    this.initDefaultRoles();
  }

  private async initDefaultRoles() {
    const count = await this.roleModel.countDocuments().exec();
    if (count === 0) {
      // Create admin role
      await this.roleModel.create({
        name: 'admin',
        description: 'Quản trị viên hệ thống với tất cả quyền',
        permissions: [
          'manage_all',
          'create_students',
          'update_students',
          'delete_students',
          'read_students',
        ],
      });

      // Create user role
      await this.roleModel.create({
        name: 'user',
        description: 'Người dùng thông thường',
        permissions: ['read_students'],
      });

      console.log('Default roles created successfully');
    }
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // Check if role with this name already exists
    const existingRole = await this.roleModel
      .findOne({
        name: createRoleDto.name,
      })
      .exec();

    if (existingRole) {
      throw new ConflictException(`Vai trò "${createRoleDto.name}" đã tồn tại`);
    }

    // You can add additional validation here if needed
    // For example, restrict creation of certain role names or validate permissions

    const createdRole = new this.roleModel(createRoleDto);
    return createdRole.save();
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel.find().exec();
  }

  async findById(id: string): Promise<RoleDocument> {
    const role = await this.roleModel.findById(id).exec();

    if (!role) {
      throw new NotFoundException(`Vai trò với ID "${id}" không tìm thấy`);
    }
    return role;
  }

  async findByName(name: string): Promise<RoleDocument> {
    const role = await this.roleModel.findOne({ name }).exec();

    if (!role) {
      throw new NotFoundException(`Vai trò "${name}" không tìm thấy`);
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    // Check if updating name and if it exists already
    if (updateRoleDto.name) {
      const existingRole = await this.roleModel
        .findOne({
          name: updateRoleDto.name,
          _id: { $ne: id }, // Exclude current role
        })
        .exec();

      if (existingRole) {
        throw new ConflictException(
          `Vai trò "${updateRoleDto.name}" đã tồn tại`,
        );
      }
    }

    // Add updated date
    const updatedData = {
      ...updateRoleDto,
      updatedAt: new Date(),
    };

    const updatedRole = await this.roleModel
      .findByIdAndUpdate(id, updatedData, { new: true })
      .exec();

    if (!updatedRole) {
      throw new NotFoundException(`Vai trò với ID "${id}" không tìm thấy`);
    }

    return updatedRole;
  }
  async delete(id: string): Promise<Role | null> {
    // Check if it's a default role
    const role = await this.roleModel.findById(id).exec();

    if (!role) {
      throw new NotFoundException(`Vai trò với ID "${id}" không tìm thấy`);
    }

    // Prevent deletion of system-defined roles
    if (role.name === 'admin' || role.name === 'user') {
      throw new ConflictException(
        `Không thể xóa vai trò mặc định "${role.name}"`,
      );
    }

    return this.roleModel.findByIdAndDelete(id).exec();
  }

  async addPermission(id: string, permission: string): Promise<Role> {
    const role = await this.roleModel.findById(id).exec();

    if (!role) {
      throw new NotFoundException(`Vai trò với ID "${id}" không tìm thấy`);
    }

    if (!role.permissions.includes(permission)) {
      role.permissions.push(permission);
      role.updatedAt = new Date();
      return role.save();
    }

    return role;
  }

  async removePermission(id: string, permission: string): Promise<Role> {
    const role = await this.roleModel.findById(id).exec();

    if (!role) {
      throw new NotFoundException(`Vai trò với ID "${id}" không tìm thấy`);
    }

    role.permissions = role.permissions.filter((p) => p !== permission);
    role.updatedAt = new Date();
    return role.save();
  }
}
