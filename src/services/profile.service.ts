import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from '../schemas/profile.schema';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Profile.name) private profileModel: Model<Profile>) {}

  async create(data: Partial<Profile>): Promise<Profile> {
    const createdProfile = new this.profileModel(data);
    return createdProfile.save();
  }

  async findAll(): Promise<Profile[]> {
    return this.profileModel.find().exec();
  }

  async findById(id: string): Promise<Profile | null> {
    return this.profileModel.findById(id).exec();
  }

  async updateById(id: string, data: Partial<Profile>): Promise<Profile | null> {
    return this.profileModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteById(id: string): Promise<Profile | null> {
    return this.profileModel.findByIdAndDelete(id).exec();
  }
}
