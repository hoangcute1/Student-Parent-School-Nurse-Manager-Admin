import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vaccine, VaccineDocument } from '@/schemas/vaccine.schema';
import { CreateVaccineDto } from '@/decorations/dto/create-vaccine.dto';
import { UpdateVaccineDto } from '@/decorations/dto/update-vaccine.dto';

@Injectable()
export class VaccineService {
  constructor(
    @InjectModel(Vaccine.name)
    private vaccineModel: Model<VaccineDocument>,
  ) {}

  async create(createVaccineDto: CreateVaccineDto): Promise<Vaccine> {
    const createdVaccine = new this.vaccineModel(createVaccineDto);
    return createdVaccine.save();
  }

  async findAll(): Promise<Vaccine[]> {
    return this.vaccineModel.find().exec();
  }

  async findById(id: string): Promise<Vaccine> {
    const vaccine = await this.vaccineModel.findById(id).exec();

    if (!vaccine) {
      throw new NotFoundException(`Vaccine with ID ${id} not found`);
    }

    return vaccine;
  }

  async update(
    id: string,
    updateVaccineDto: UpdateVaccineDto,
  ): Promise<Vaccine> {
    const updatedVaccine = await this.vaccineModel
      .findByIdAndUpdate(id, updateVaccineDto, { new: true })
      .exec();

    if (!updatedVaccine) {
      throw new NotFoundException(`Vaccine with ID ${id} not found`);
    }

    return updatedVaccine;
  }

  async remove(id: string): Promise<Vaccine> {
    const deletedVaccine = await this.vaccineModel.findByIdAndDelete(id).exec();

    if (!deletedVaccine) {
      throw new NotFoundException(`Vaccine with ID ${id} not found`);
    }

    return deletedVaccine;
  }
}
