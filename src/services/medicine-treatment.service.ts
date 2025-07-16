import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MedicineTreatment,
  MedicineTreatmentDocument,
} from '@/schemas/medicine-treatment.schema';
import { CreateMedicineTreatmentDto, UpdateMedicineTreatmentDto } from '@/decorations/dto/medicine-treatment.dto';

@Injectable()
export class MedicineTreatmentService {
  constructor(
    @InjectModel(MedicineTreatment.name)
    private medicineTreatmentModel: Model<MedicineTreatmentDocument>,
  ) {}

  async create(
    createMedicineTreatmentDto: CreateMedicineTreatmentDto,
  ): Promise<MedicineTreatment> {
    const createdMedicineTreatment = new this.medicineTreatmentModel(
      createMedicineTreatmentDto,
    );
    return createdMedicineTreatment.save();
  }

  async findAll(): Promise<MedicineTreatment[]> {
    return this.medicineTreatmentModel
      .find()
      .populate('treatment')
      .populate('medicine')
      .exec();
  }

  async findById(id: string): Promise<MedicineTreatment> {
    const medicineTreatment = await this.medicineTreatmentModel
      .findById(id)
      .populate('treatment')
      .populate('medicine')
      .exec();

    if (!medicineTreatment) {
      throw new NotFoundException(`Medicine treatment with ID ${id} not found`);
    }

    return medicineTreatment;
  }

  async findByTreatmentId(treatmentId: string): Promise<MedicineTreatment[]> {
    return this.medicineTreatmentModel
      .find({ treatment: treatmentId })
      .populate('medicine')
      .exec();
  }

  async update(
    id: string,
    updateMedicineTreatmentDto: UpdateMedicineTreatmentDto,
  ): Promise<MedicineTreatment> {
    const updatedMedicineTreatment = await this.medicineTreatmentModel
      .findByIdAndUpdate(id, updateMedicineTreatmentDto, { new: true })
      .populate('treatment')
      .populate('medicine')
      .exec();

    if (!updatedMedicineTreatment) {
      throw new NotFoundException(`Medicine treatment with ID ${id} not found`);
    }

    return updatedMedicineTreatment;
  }

  async remove(id: string): Promise<MedicineTreatment> {
    const deletedMedicineTreatment = await this.medicineTreatmentModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedMedicineTreatment) {
      throw new NotFoundException(`Medicine treatment with ID ${id} not found`);
    }

    return deletedMedicineTreatment;
  }
}
