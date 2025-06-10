import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Suggestion, SuggestionDocument } from '@/schemas/suggestion.schema';
import {
  CreateSuggestionDto,
  UpdateSuggestionDto,
} from '@/decorations/dto/suggestion.dto';

@Injectable()
export class SuggestionService {
  constructor(
    @InjectModel(Suggestion.name)
    private suggestionModel: Model<SuggestionDocument>,
  ) {}

  async create(createSuggestionDto: CreateSuggestionDto): Promise<Suggestion> {
    const createdSuggestion = new this.suggestionModel(createSuggestionDto);
    return createdSuggestion.save();
  }

  async findAll(): Promise<Suggestion[]> {
    return this.suggestionModel.find().populate('parent').exec();
  }

  async findByParent(parentId: string): Promise<Suggestion[]> {
    return this.suggestionModel
      .find({ parent: parentId })
      .populate('parent')
      .exec();
  }

  async findById(id: string): Promise<Suggestion> {
    const suggestion = await this.suggestionModel
      .findById(id)
      .populate('parent')
      .exec();

    if (!suggestion) {
      throw new NotFoundException(`Suggestion with ID "${id}" not found`);
    }

    return suggestion;
  }

  async update(
    id: string,
    updateSuggestionDto: UpdateSuggestionDto,
  ): Promise<Suggestion> {
    const updatedSuggestion = await this.suggestionModel
      .findByIdAndUpdate(id, updateSuggestionDto, { new: true })
      .populate('parent')
      .exec();

    if (!updatedSuggestion) {
      throw new NotFoundException(`Suggestion with ID "${id}" not found`);
    }

    return updatedSuggestion;
  }

  async remove(id: string): Promise<void> {
    const result = await this.suggestionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Suggestion with ID "${id}" not found`);
    }
  }
}
