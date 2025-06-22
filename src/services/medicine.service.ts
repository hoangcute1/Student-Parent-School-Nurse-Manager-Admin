import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Medicine,
  MedicineDocument,
  MedicineType,
  MedicineUnit,
} from '@/schemas/medicine.schema';
import { CreateMedicineDto } from '@/decorations/dto/create-medicine.dto';
import { UpdateMedicineDto } from '@/decorations/dto/update-medicine.dto';
import {
  FilterMedicineDto,
  FilterMedicineWithPaginationDto,
} from '@/decorations/dto/filter-medicine.dto';

@Injectable()
export class MedicineService {
  constructor(
    @InjectModel(Medicine.name)
    private medicineModel: Model<MedicineDocument>,
  ) {}

  /**
   * Create a new medicine
   */
  async create(createMedicineDto: CreateMedicineDto): Promise<Medicine> {
    try {
      const createdMedicine = new this.medicineModel(createMedicineDto);
      return await createdMedicine.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(`Validation failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Find all medicines with optional filters and pagination
   */
  async findAll(query?: FilterMedicineWithPaginationDto): Promise<{
    data: Medicine[];
    meta: {
      totalItems: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    try {
      const filter: any = {};
      const page = query?.page || 1;
      const limit = query?.limit || 10;
      const skip = (page - 1) * limit;

      // Apply filters if provided
      if (query?.name) {
        filter.name = { $regex: query.name, $options: 'i' }; // Case-insensitive search
      }
      if (query?.type) {
        filter.type = query.type;
      }
      if (query?.unit) {
        filter.unit = query.unit;
      }
      if (query?.prescription !== undefined) {
        filter.is_prescription_required = query.prescription;
      }
      if (query?.manufacturer) {
        filter.manufacturer = { $regex: query.manufacturer, $options: 'i' };
      }

      const totalItems = await this.medicineModel.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / limit);

      const medicines = await this.medicineModel
        .find(filter)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .exec();

      return {
        data: medicines,
        meta: {
          totalItems,
          itemsPerPage: limit,
          totalPages,
          currentPage: page,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        `Error fetching medicines: ${error.message}`,
      );
    }
  }

  /**
   * Find a medicine by its ID
   */
  async findById(id: string): Promise<Medicine> {
    try {
      const medicine = await this.medicineModel.findById(id).exec();
      if (!medicine) {
        throw new NotFoundException(`Medicine with ID ${id} not found`);
      }
      return medicine;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.name === 'CastError') {
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }
      throw error;
    }
  }

  /**
   * Find medicines by type with pagination
   */
  async findByType(
    type: MedicineType,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Medicine[];
    meta: {
      totalItems: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    try {
      const skip = (page - 1) * limit;

      const totalItems = await this.medicineModel.countDocuments({ type });
      const totalPages = Math.ceil(totalItems / limit);

      const medicines = await this.medicineModel
        .find({ type })
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .exec();

      return {
        data: medicines,
        meta: {
          totalItems,
          itemsPerPage: limit,
          totalPages,
          currentPage: page,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        `Error fetching medicines by type: ${error.message}`,
      );
    }
  }

  /**
   * Search for medicines by name or description
   */
  async search(
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Medicine[];
    meta: {
      totalItems: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    try {
      const skip = (page - 1) * limit;

      const filter = {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { manufacturer: { $regex: searchTerm, $options: 'i' } },
        ],
      };

      const totalItems = await this.medicineModel.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / limit);

      const medicines = await this.medicineModel
        .find(filter)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .exec();

      return {
        data: medicines,
        meta: {
          totalItems,
          itemsPerPage: limit,
          totalPages,
          currentPage: page,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        `Error searching medicines: ${error.message}`,
      );
    }
  }

  /**
   * Update a medicine by its ID
   */
  async update(
    id: string,
    updateMedicineDto: UpdateMedicineDto,
  ): Promise<Medicine> {
    try {
      const updatedMedicine = await this.medicineModel
        .findByIdAndUpdate(id, updateMedicineDto, { new: true })
        .exec();

      if (!updatedMedicine) {
        throw new NotFoundException(`Medicine with ID ${id} not found`);
      }

      return updatedMedicine;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.name === 'CastError') {
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }
      if (error.name === 'ValidationError') {
        throw new BadRequestException(`Validation failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Delete a medicine by its ID
   */
  async remove(id: string): Promise<{ id: string; deleted: boolean }> {
    try {
      const deletedMedicine = await this.medicineModel
        .findByIdAndDelete(id)
        .exec();

      if (!deletedMedicine) {
        throw new NotFoundException(`Medicine with ID ${id} not found`);
      }

      return { id, deleted: true };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.name === 'CastError') {
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }
      throw error;
    }
  }
}
