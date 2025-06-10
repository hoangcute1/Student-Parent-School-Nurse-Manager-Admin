import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback, FeedbackDocument } from '@/schemas/feedback.schema';
import {
  CreateFeedbackDto,
  UpdateFeedbackDto,
  FilterFeedbackDto,
} from '@/decorations/dto/feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name)
    private feedbackModel: Model<FeedbackDocument>,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const createdFeedback = new this.feedbackModel(createFeedbackDto);
    return createdFeedback.save();
  }

  async findAll(): Promise<Feedback[]> {
    return this.feedbackModel
      .find()
      .select('-__v')
      .populate('parent')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<Feedback> {
    const feedback = await this.feedbackModel
      .findById(id)
      .select('-__v')
      .populate('parent')
      .exec();

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID "${id}" not found`);
    }
    return feedback;
  }

  async findByParent(parentId: string): Promise<Feedback[]> {
    return this.feedbackModel
      .find({ parent: parentId })
      .select('-__v')
      .populate('parent')
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(
    id: string,
    updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<Feedback> {
    const feedback = await this.feedbackModel
      .findByIdAndUpdate(
        id,
        { response: updateFeedbackDto.response },
        { new: true },
      )
      .select('-__v')
      .populate('parent')
      .exec();

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID "${id}" not found`);
    }
    return feedback;
  }

  async remove(id: string): Promise<void> {
    const result = await this.feedbackModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Feedback with ID "${id}" not found`);
    }
  }
}
