import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PeriodicCampaign,
  PeriodicCampaignDocument,
} from '@/schemas/periodic-campaign.schema';
import { CreatePeriodicCampaignDto } from '@/decorations/dto/create-periodic-campaign.dto';
import { UpdatePeriodicCampaignDto } from '@/decorations/dto/update-periodic-campaign.dto';

@Injectable()
export class PeriodicCampaignService {
  constructor(
    @InjectModel(PeriodicCampaign.name)
    private periodicCampaignModel: Model<PeriodicCampaignDocument>,
  ) {}

  async create(
    createPeriodicCampaignDto: CreatePeriodicCampaignDto,
  ): Promise<PeriodicCampaign> {
    const createdPeriodicCampaign = new this.periodicCampaignModel(
      createPeriodicCampaignDto,
    );
    return createdPeriodicCampaign.save();
  }

  async findAll(): Promise<PeriodicCampaign[]> {
    return this.periodicCampaignModel.find().populate('staff').exec();
  }

  async findById(id: string): Promise<PeriodicCampaign> {
    const periodicCampaign = await this.periodicCampaignModel
      .findById(id)
      .populate('staff')
      .exec();

    if (!periodicCampaign) {
      throw new NotFoundException(`Periodic campaign with ID ${id} not found`);
    }

    return periodicCampaign;
  }

  async findByStaffId(staffId: string): Promise<PeriodicCampaign[]> {
    return this.periodicCampaignModel.find({ staff: staffId }).exec();
  }

  async update(
    id: string,
    updatePeriodicCampaignDto: UpdatePeriodicCampaignDto,
  ): Promise<PeriodicCampaign> {
    const updatedPeriodicCampaign = await this.periodicCampaignModel
      .findByIdAndUpdate(id, updatePeriodicCampaignDto, { new: true })
      .populate('staff')
      .exec();

    if (!updatedPeriodicCampaign) {
      throw new NotFoundException(`Periodic campaign with ID ${id} not found`);
    }

    return updatedPeriodicCampaign;
  }

  async remove(id: string): Promise<PeriodicCampaign> {
    const deletedPeriodicCampaign = await this.periodicCampaignModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedPeriodicCampaign) {
      throw new NotFoundException(`Periodic campaign with ID ${id} not found`);
    }

    return deletedPeriodicCampaign;
  }
}
