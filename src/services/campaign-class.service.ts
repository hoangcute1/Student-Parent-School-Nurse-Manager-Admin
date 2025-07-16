import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CampaignClass,
  CampaignClassDocument,
} from '@/schemas/campaign-class.schema';
import { CreateCampaignClassDto } from '@/decorations/dto/campaign-class.dto';
import { UpdateCampaignClassDto } from '@/decorations/dto/campaign-class.dto';

@Injectable()
export class CampaignClassService {
  constructor(
    @InjectModel(CampaignClass.name)
    private campaignClassModel: Model<CampaignClassDocument>,
  ) {}

  /**
   * Create a new campaign-class association
   */
  async create(
    createCampaignClassDto: CreateCampaignClassDto,
  ): Promise<CampaignClassDocument> {
    // Check if the association already exists
    const existing = await this.campaignClassModel.findOne({
      campaign: createCampaignClassDto.campaign,
      class: createCampaignClassDto.class,
    });

    if (existing) {
      throw new ConflictException(
        'Campaign-Class association already exists for this campaign and class',
      );
    }

    const createdCampaignClass = new this.campaignClassModel(
      createCampaignClassDto,
    );
    return createdCampaignClass.save();
  }

  /**
   * Find all campaign-class associations
   */
  async findAll(): Promise<CampaignClassDocument[]> {
    return this.campaignClassModel
      .find()
      .populate('campaign')
      .populate('class')
      .exec();
  }

  /**
   * Find campaign-class associations by campaign ID
   */
  async findByCampaign(campaignId: string): Promise<CampaignClassDocument[]> {
    return this.campaignClassModel
      .find({ campaign: campaignId })
      .populate('campaign')
      .populate('class')
      .exec();
  }

  /**
   * Find campaign-class associations by class ID
   */
  async findByClass(classId: string): Promise<CampaignClassDocument[]> {
    return this.campaignClassModel
      .find({ class: classId })
      .populate('campaign')
      .populate('class')
      .exec();
  }

  /**
   * Find a campaign-class association by ID
   */
  async findById(id: string): Promise<CampaignClassDocument> {
    const campaignClass = await this.campaignClassModel
      .findById(id)
      .populate('campaign')
      .populate('class')
      .exec();

    if (!campaignClass) {
      throw new NotFoundException(
        `Campaign-Class association with ID ${id} not found`,
      );
    }

    return campaignClass;
  }

  /**
   * Update a campaign-class association
   */
  async update(
    id: string,
    updateCampaignClassDto: UpdateCampaignClassDto,
  ): Promise<CampaignClassDocument> {
    const updatedCampaignClass = await this.campaignClassModel
      .findByIdAndUpdate(id, updateCampaignClassDto, { new: true })
      .populate('campaign')
      .populate('class')
      .exec();

    if (!updatedCampaignClass) {
      throw new NotFoundException(
        `Campaign-Class association with ID ${id} not found`,
      );
    }

    return updatedCampaignClass;
  }

  /**
   * Delete a campaign-class association
   */
  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.campaignClassModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(
        `Campaign-Class association with ID ${id} not found`,
      );
    }

    return { deleted: true };
  }

  /**
   * Delete all campaign-class associations for a campaign
   */
  async removeByCampaign(
    campaignId: string,
  ): Promise<{ deleted: boolean; count: number }> {
    const result = await this.campaignClassModel
      .deleteMany({ campaign: campaignId })
      .exec();
    return { deleted: true, count: result.deletedCount };
  }

  /**
   * Delete all campaign-class associations for a class
   */
  async removeByClass(
    classId: string,
  ): Promise<{ deleted: boolean; count: number }> {
    const result = await this.campaignClassModel
      .deleteMany({ class: classId })
      .exec();
    return { deleted: true, count: result.deletedCount };
  }
}
