import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Profile, ProfileDocument } from '../schemas/profile.schema';
import { CreateProfileDto } from '@/decorations/dto/create-profile.dto';
 export { ProfileDocument }; 
import { UpdateProfileDto, UpdateProfileWithoutUserDto } from '@/decorations/dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Profile.name) private profileModel: Model<ProfileDocument>) {}

  async create(createProfileDto: CreateProfileDto): Promise<ProfileDocument> {
    // Check if a profile already exists for this user
    const existingProfile = await this.profileModel
      .findOne({
        user: createProfileDto.user,
      })
      .exec();

    if (existingProfile) {
      throw new BadRequestException('Profile for this user already exists');
    }

    const createdProfile = new this.profileModel({
      ...createProfileDto,
      user: createProfileDto.user, // Map user from DTO to user in schema
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

  async findByuser(user: string): Promise<ProfileDocument | null> {
    return this.profileModel.findOne({ user: user }).populate('user').exec();
  }

  async updateById(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileDocument | null> {
    const updateData = { ...updateProfileDto, updated_at: new Date() };

    // If user is provided in the DTO, map it to the user field
    if (updateProfileDto.user) {
      updateData['user'] = updateProfileDto.user;
      delete updateData['user'];
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

  async updateByUserId(
    userId: string,
    updateProfileDto: UpdateProfileWithoutUserDto,
  ): Promise<ProfileDocument | null> {
    const updateData = { ...updateProfileDto, updated_at: new Date() };
    const updatedProfile = await this.profileModel
      .findOneAndUpdate({ user: new Types.ObjectId(userId) }, updateData, { new: true })
      .populate('user')
      .exec();
    if (!updatedProfile) {
      throw new NotFoundException(`Profile with userId ${userId} not found`);
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
