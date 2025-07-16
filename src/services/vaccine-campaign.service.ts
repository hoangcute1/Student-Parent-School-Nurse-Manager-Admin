import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  VaccineCampaign,
  VaccineCampaignDocument,
} from '@/schemas/vaccine-campaign.schema';
import { VaccineCampaignDto } from '@/decorations/dto/vaccine-campaign.dto';


@Injectable()
export class VaccineCampaignService {
  constructor(
    @InjectModel(VaccineCampaign.name)
    private vaccineCampaignModel: Model<VaccineCampaignDocument>,
  ) {}

  async create(
    createVaccineCampaignDto: VaccineCampaignDto,
  ): Promise<VaccineCampaign> {
    const createdVaccineCampaign = new this.vaccineCampaignModel(
      createVaccineCampaignDto,
    );
    return createdVaccineCampaign.save();
  }

  async findAll(): Promise<VaccineCampaign[]> {
    return this.vaccineCampaignModel
      .find()
      .populate('vaccine')
      .populate('staff')
      .exec();
  }

  async findById(id: string): Promise<VaccineCampaign> {
    const vaccineCampaign = await this.vaccineCampaignModel
      .findById(id)
      .populate('vaccine')
      .populate('staff')
      .exec();

    if (!vaccineCampaign) {
      throw new NotFoundException(`Vaccine campaign with ID ${id} not found`);
    }

    return vaccineCampaign;
  }

  async findByVaccineId(vaccineId: string): Promise<VaccineCampaign[]> {
    return this.vaccineCampaignModel
      .find({ vaccine: vaccineId })
      .populate('staff')
      .exec();
  }

  async findByStaffId(staffId: string): Promise<VaccineCampaign[]> {
    return this.vaccineCampaignModel
      .find({ staff: staffId })
      .populate('vaccine')
      .exec();
  }

  async update(
    id: string,
    updateVaccineCampaignDto: VaccineCampaignDto,
  ): Promise<VaccineCampaign> {
    const updatedVaccineCampaign = await this.vaccineCampaignModel
      .findByIdAndUpdate(id, updateVaccineCampaignDto, { new: true })
      .populate('vaccine')
      .populate('staff')
      .exec();

    if (!updatedVaccineCampaign) {
      throw new NotFoundException(`Vaccine campaign with ID ${id} not found`);
    }

    return updatedVaccineCampaign;
  }

  async remove(id: string): Promise<VaccineCampaign> {
    const deletedVaccineCampaign = await this.vaccineCampaignModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedVaccineCampaign) {
      throw new NotFoundException(`Vaccine campaign with ID ${id} not found`);
    }

    return deletedVaccineCampaign;
  }
}
