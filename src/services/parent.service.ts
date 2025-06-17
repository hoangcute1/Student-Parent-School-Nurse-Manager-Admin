import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Parent, ParentDocument } from '@/schemas/parent.schema';

@Injectable()
export class ParentService {
  constructor(
    @InjectModel(Parent.name) private parentModel: Model<ParentDocument>,
  ) {}
  async findAll(): Promise<any[]> {
    const parents = await this.parentModel
      .find()
      .populate<{ userId: { id: string; email: string } }>('userId')
      .exec();
    return parents.map((parent) => ({
      userId: parent.userId?.id,
      name: parent.name,
      phone: parent.phone,
      address: parent.address,
      email: parent.userId?.email,
      createdAt: parent.createdAt,
      updatedAt: parent.updatedAt,
    }));
  }

  async findById(id: string): Promise<Parent> {
    const parent = await this.parentModel
      .findById(id)
      .populate('userId')
      .exec();
    if (!parent) {
      throw new NotFoundException(`Parent with ID "${id}" not found`);
    }
    return parent;
  }

  async findByUserId(userId: string): Promise<Parent | null> {
    return this.parentModel.findOne({ userId }).exec();
  }

  async create(createParentDto: any): Promise<Parent> {
    // Check if parent with this userId already exists
    const existingParent = await this.parentModel
      .findOne({ userId: createParentDto.userId })
      .exec();

    if (existingParent) {
      throw new ConflictException('A parent with this user ID already exists');
    }

    const createdParent = new this.parentModel(createParentDto);
    return createdParent.save();
  }

  async update(id: string, updateParentDto: any): Promise<Parent> {
    const updatedParent = await this.parentModel
      .findByIdAndUpdate(
        id,
        { ...updateParentDto, updatedAt: new Date() },
        { new: true },
      )
      .exec();

    if (!updatedParent) {
      throw new NotFoundException(`Parent with ID "${id}" not found`);
    }

    return updatedParent;
  }

  async remove(id: string): Promise<any> {
    const deletedParent = await this.parentModel.findByIdAndDelete(id).exec();

    if (!deletedParent) {
      throw new NotFoundException(`Parent with ID "${id}" not found`);
    }

    return { id, deleted: true };
  }
}
