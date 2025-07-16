import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Class, ClassDocument } from '@/schemas/class.schema';
import { CreateClassDto } from '@/decorations/dto/class.dto';


@Injectable()
export class ClassService {
  constructor(@InjectModel(Class.name) private classModel: Model<ClassDocument>) {}

  async create(createClassDto: CreateClassDto): Promise<Class> {
    const exists = await this.classModel.findOne({ name: createClassDto.name });
    if (exists) throw new ConflictException('Tên lớp đã tồn tại');
    const created = new this.classModel({
      ...createClassDto,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return created.save();
  }

  async findAll(): Promise<Class[]> {
    return this.classModel.find().exec();
  }

  async findById(id: string): Promise<Class> {
    const found = await this.classModel.findById(id).exec();
    if (!found) throw new NotFoundException('Không tìm thấy lớp');
    return found;
  }

  async update(id: string, updateClassDto: CreateClassDto): Promise<Class> {
    const updated = await this.classModel
      .findByIdAndUpdate(id, { ...updateClassDto, updated_at: new Date() }, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Không tìm thấy lớp');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.classModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Không tìm thấy lớp');
  }

  async findByName(name: string): Promise<Class | null> {
    return this.classModel.findOne({ name }).exec();
  }

  async findByGradeLevel(gradeLevel: number): Promise<Class[]> {
    try {
      // Logic để tìm lớp theo khối học
      // Giả sử tên lớp có format như "1A", "1B", "2A", "2B", etc.
      const gradePattern = new RegExp(`^${gradeLevel}[A-Z]`, 'i');

      return await this.classModel.find({ name: gradePattern }).exec();
    } catch (error) {
      console.error('Error finding classes by grade level:', error);
      return [];
    }
  }
}
