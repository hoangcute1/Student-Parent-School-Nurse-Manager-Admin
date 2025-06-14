import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CampaignStudent, CampaignStudentDocument } from '@/schemas/campaign-student';
import { CreateCampaignStudentDto } from '@/decorations/dto/create-campaign-student.dto';
import { UpdateCampaignStudentDto } from '@/decorations/dto/update-campaign-student.dto';

@Injectable()
export class CampaignStudentService {
  constructor(
    @InjectModel(CampaignStudent.name)
    private campaignStudentModel: Model<CampaignStudentDocument>,
  ) {}

  /**
   * Create a new campaign-student association
   */
  async create(createCampaignStudentDto: CreateCampaignStudentDto): Promise<CampaignStudentDocument> {
    // Check if the association already exists
    const existing = await this.campaignStudentModel.findOne({
      class_campaign: createCampaignStudentDto.class_campaign,
      student: createCampaignStudentDto.student,
    });

    if (existing) {
      throw new ConflictException(
        'Campaign-Student association already exists for this campaign and student',
      );
    }

    const createdCampaignStudent = new this.campaignStudentModel(createCampaignStudentDto);
    return createdCampaignStudent.save();
  }

  /**
   * Find all campaign-student associations
   */
  async findAll(): Promise<CampaignStudentDocument[]> {
    return this.campaignStudentModel.find()
      .populate('class_campaign')
      .populate('student')
      .exec();
  }

  /**
   * Find campaign-student associations by class campaign ID
   */
  async findByClassCampaign(classCampaignId: string): Promise<CampaignStudentDocument[]> {
    return this.campaignStudentModel.find({ class_campaign: classCampaignId })
      .populate('class_campaign')
      .populate('student')
      .exec();
  }

  /**
   * Find campaign-student associations by student ID
   */
  async findByStudent(studentId: string): Promise<CampaignStudentDocument[]> {
    return this.campaignStudentModel.find({ student: studentId })
      .populate('class_campaign')
      .populate('student')
      .exec();
  }

  /**
   * Find campaign-student associations by status
   */
  async findByStatus(status: string): Promise<CampaignStudentDocument[]> {
    return this.campaignStudentModel.find({ status })
      .populate('class_campaign')
      .populate('student')
      .exec();
  }

  /**
   * Find a campaign-student association by ID
   */
  async findById(id: string): Promise<CampaignStudentDocument> {
    const campaignStudent = await this.campaignStudentModel.findById(id)
      .populate('class_campaign')
      .populate('student')
      .exec();
    
    if (!campaignStudent) {
      throw new NotFoundException(`Campaign-Student association with ID ${id} not found`);
    }
    
    return campaignStudent;
  }

  /**
   * Update a campaign-student association
   */
  async update(
    id: string,
    updateCampaignStudentDto: UpdateCampaignStudentDto,
  ): Promise<CampaignStudentDocument> {
    const updatedCampaignStudent = await this.campaignStudentModel
      .findByIdAndUpdate(id, updateCampaignStudentDto, { new: true })
      .populate('class_campaign')
      .populate('student')
      .exec();
    
    if (!updatedCampaignStudent) {
      throw new NotFoundException(`Campaign-Student association with ID ${id} not found`);
    }
    
    return updatedCampaignStudent;
  }

  /**
   * Delete a campaign-student association
   */
  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.campaignStudentModel.deleteOne({ _id: id }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Campaign-Student association with ID ${id} not found`);
    }
    
    return { deleted: true };
  }

  /**
   * Delete all campaign-student associations for a class campaign
   */
  async removeByClassCampaign(classCampaignId: string): Promise<{ deleted: boolean; count: number }> {
    const result = await this.campaignStudentModel.deleteMany({ class_campaign: classCampaignId }).exec();
    return { deleted: true, count: result.deletedCount };
  }

  /**
   * Delete all campaign-student associations for a student
   */
  async removeByStudent(studentId: string): Promise<{ deleted: boolean; count: number }> {
    const result = await this.campaignStudentModel.deleteMany({ student: studentId }).exec();
    return { deleted: true, count: result.deletedCount };
  }

  /**
   * Batch create campaign-student associations
   */
  async batchCreate(createDtos: CreateCampaignStudentDto[]): Promise<{ created: number, data: CampaignStudentDocument[] }> {
    const createdItems: CampaignStudentDocument[] = [];
    
    for (const dto of createDtos) {
      try {
        const created = await this.create(dto);
        createdItems.push(created);
      } catch (error) {
        if (!(error instanceof ConflictException)) {
          throw error;
        }
        // Skip conflicting items
      }
    }
    
    return { created: createdItems.length, data: createdItems };
  }

  /**
   * Update campaign-student status
   */
  async updateStatus(
    id: string,
    status: string,
  ): Promise<CampaignStudentDocument> {
    const updatedCampaignStudent = await this.campaignStudentModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate('class_campaign')
      .populate('student')
      .exec();
    
    if (!updatedCampaignStudent) {
      throw new NotFoundException(`Campaign-Student association with ID ${id} not found`);
    }
    
    return updatedCampaignStudent;
  }
}
