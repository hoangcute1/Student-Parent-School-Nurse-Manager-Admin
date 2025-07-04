import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FeedbackResponse, FeedbackResponseDocument } from '@/schemas/feedback-response.schema';
import {
  CreateFeedbackResponseDto,
  UpdateFeedbackResponseDto,
} from '@/decorations/dto/feedback-response.dto';

@Injectable()
export class FeedbackResponseService {
  constructor(
    @InjectModel(FeedbackResponse.name)
    private feedbackResponseModel: Model<FeedbackResponseDocument>,
  ) {}

  async create(createFeedbackResponseDto: CreateFeedbackResponseDto): Promise<FeedbackResponse> {
    const createdResponse = new this.feedbackResponseModel(createFeedbackResponseDto);
    return createdResponse.save();
  }

  async findAll(): Promise<FeedbackResponse[]> {
    return this.feedbackResponseModel
      .find()
      .populate('feedback')
      .populate('responder', 'username email role')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByFeedback(feedbackId: string): Promise<FeedbackResponse[]> {
    return this.feedbackResponseModel
      .find({ feedback: feedbackId })
      .populate('responder', 'username email role')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<FeedbackResponse> {
    const response = await this.feedbackResponseModel
      .findById(id)
      .populate('feedback')
      .populate('responder', 'username email role')
      .exec();

    if (!response) {
      throw new NotFoundException(`Feedback response with ID "${id}" not found`);
    }
    return response;
  }

  async update(id: string, updateDto: UpdateFeedbackResponseDto): Promise<FeedbackResponse> {
    const response = await this.feedbackResponseModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .populate('feedback')
      .populate('responder', 'username email role')
      .exec();

    if (!response) {
      throw new NotFoundException(`Feedback response with ID "${id}" not found`);
    }
    return response;
  }

  async markAsRead(id: string): Promise<FeedbackResponse> {
    return this.update(id, { isRead: true });
  }

  async remove(id: string): Promise<void> {
    const result = await this.feedbackResponseModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Feedback response with ID "${id}" not found`);
    }
  }
}
