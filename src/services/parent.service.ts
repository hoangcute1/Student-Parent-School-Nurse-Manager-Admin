import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Parent, ParentDocument } from '@/schemas/parent.schema';
import { CreateParentDto } from '@/decorations/dto/create-parent.dto';
import { UpdateParentDto } from '@/decorations/dto/update-parent.dto';

@Injectable()
export class ParentService {
  constructor(
    @InjectModel(Parent.name) private parentModel: Model<ParentDocument>,
  ) {}

  async findAll(): Promise<any[]> {
    const parents = await this.parentModel.find().populate('user').exec();

    return parents.map((parent) => ({
      id: parent._id,
      user: parent.user,
    }));
  }
  async validateParent(user: string): Promise<ParentDocument | null> {
    const parent = await this.parentModel.findOne({ user }).exec();
    if (!parent) {
      throw new NotFoundException(`Parent with user ID "${user}" not found`);
    }
    return parent;
  }

  async findById(id: string): Promise<ParentDocument> {
    const parent = await this.parentModel.findById(id).populate('user').exec();

    if (!parent) {
      throw new NotFoundException(`Parent with ID "${id}" not found`);
    }
    return parent;
  }

  async findByUserId(userId: string): Promise<ParentDocument | null> {
    return this.parentModel.findOne({ user: userId }).exec();
  }

  async create(createParentDto: CreateParentDto): Promise<ParentDocument> {
    const existingParent = await this.parentModel
      .findOne({ user: createParentDto.user })
      .exec();

    if (existingParent) {
      throw new ConflictException('A parent with this user ID already exists');
    }

    const createdParent = new this.parentModel({
      user: createParentDto.user,
    });

    return createdParent.save();
  }

  async update(
    id: string,
    updateParentDto: UpdateParentDto,
  ): Promise<ParentDocument> {
    const updatedParent = await this.parentModel
      .findByIdAndUpdate(id, updateParentDto, { new: true })
      .exec();

    if (!updatedParent) {
      throw new NotFoundException(`Parent with ID "${id}" not found`);
    }

    return updatedParent;
  }

  async remove(id: string): Promise<{ id: string; deleted: boolean }> {
    const deletedParent = await this.parentModel.findByIdAndDelete(id).exec();

    if (!deletedParent) {
      throw new NotFoundException(`Parent with ID "${id}" not found`);
    }

    return { id, deleted: true };
  }
}
