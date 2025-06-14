import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from '../schemas/profile.schema';
import { CreateProfileDto } from '@/decorations/dto/create-profile.dto';
import { UpdateProfileDto } from '@/decorations/dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<ProfileDocument> {
    // Check if a profile already exists for this user
    const existingProfile = await this.profileModel
      .findOne({
        user: createProfileDto.userId,
      })
      .exec();

    if (existingProfile) {
      throw new BadRequestException('Profile for this user already exists');
    }

    const createdProfile = new this.profileModel({
      ...createProfileDto,
      user: createProfileDto.userId, // Map userId from DTO to user in schema
      created_at: new Date(),
      updated_at: new Date(),
    });
    return createdProfile.save();
  }

  async findAll(): Promise<ProfileDocument[]> {
    return this.profileModel.find().populate('user').exec();
  }

  async findById(id: string): Promise<ProfileDocument | null> {
    return this.profileModel.findById(id).exec();
  }

  async findByUserId(userId: string): Promise<ProfileDocument | null> {
    return this.profileModel.findOne({ user: userId }).populate('user').exec();
  }

  async updateById(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileDocument | null> {
    const updateData = { ...updateProfileDto, updated_at: new Date() };

    // If userId is provided in the DTO, map it to the user field
    if (updateProfileDto.userId) {
      updateData['user'] = updateProfileDto.userId;
      delete updateData['userId'];
    }

    const updatedProfile = await this.profileModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('user')
      .exec();

    if (!updatedProfile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    return updatedProfile;
  }

  async deleteById(id: string): Promise<ProfileDocument | null> {
    const deletedProfile = await this.profileModel.findByIdAndDelete(id).exec();

    if (!deletedProfile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    return deletedProfile;
  }
}
