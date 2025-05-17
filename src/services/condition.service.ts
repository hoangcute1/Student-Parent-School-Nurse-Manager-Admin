import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Condition } from '../schemas/condition.schema';

@Injectable()
export class ConditionService {
  constructor(@InjectModel(Condition.name) private conditionModel: Model<Condition>) {}

  async findAll(): Promise<Condition[]> {
    return this.conditionModel.find().exec();
  }

  async deleteById(id: string): Promise<Condition | null> {
    return this.conditionModel.findByIdAndDelete(id).exec();
  }

  async create(name: string): Promise<Condition> {
    const createdCondition = new this.conditionModel({ name });
    return createdCondition.save();
  }
}
