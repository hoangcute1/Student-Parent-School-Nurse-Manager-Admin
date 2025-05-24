import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from '../schemas/profile.schema';
import { CreateProfileDto } from '@/decorations/dto/create-profile.dto';
import { UpdateProfileDto } from '@/decorations/dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Profile.name) private profileModel: Model<Profile>) {}

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    // Check if a profile already exists for this user
    const existingProfile = await this.profileModel.findOne({
      userId: createProfileDto.userId,
    }).exec();

    if (existingProfile) {
      throw new BadRequestException('Profile for this user already exists');
    }

    const createdProfile = new this.profileModel(createProfileDto);
    return createdProfile.save();
  }

  async findAll(): Promise<Profile[]> {
    return this.profileModel.find().exec();
  }

  async findById(id: string): Promise<Profile | null> {
    return this.profileModel.findById(id).exec();
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    return this.profileModel.findOne({ userId }).exec();
  }

  async updateById(id: string, updateProfileDto: UpdateProfileDto): Promise<Profile | null> {
    const updatedProfile = await this.profileModel
      .findByIdAndUpdate(id, updateProfileDto, { new: true })
      .exec();

    if (!updatedProfile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    return updatedProfile;
  }

  async deleteById(id: string): Promise<Profile | null> {
    const deletedProfile = await this.profileModel.findByIdAndDelete(id).exec();

    if (!deletedProfile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    return deletedProfile;
  }
}
