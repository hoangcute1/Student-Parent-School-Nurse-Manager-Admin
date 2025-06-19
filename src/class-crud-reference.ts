/**
 * CRUD Operations for Class Schema
 * This file contains all the components needed for CRUD operations for the Class schema
 */

// Schema Definition
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClassDocument = Class & Document;

@Schema({ versionKey: false })
export class Class extends Document {
  @Prop({ trim: true, unique: true, required: true })
  name: string;

  @Prop({ required: true })
  grade: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const ClassSchema = SchemaFactory.createForClass(Class);

// DTOs
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateClassDto {
  @ApiProperty({ example: '10A1', description: 'Tên lớp học' })
  @IsString()
  name: string;

  @ApiProperty({ example: '10', description: 'Khối lớp' })
  @IsString()
  grade: string;
}

export class UpdateClassDto extends PartialType(CreateClassDto) {}

// Service
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
  ) {}

  /**
   * Create a new class
   * @param createClassDto - The data to create a new class
   * @returns The created class
   * @throws ConflictException if a class with the same name already exists
   */
  async create(createClassDto: CreateClassDto): Promise<Class> {
    // Check if a class with the same name already exists
    const exists = await this.classModel.findOne({ name: createClassDto.name });
    if (exists) throw new ConflictException('Tên lớp đã tồn tại');

    // Create and save the new class
    const created = new this.classModel({
      ...createClassDto,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return created.save();
  }

  /**
   * Get all classes
   * @returns An array of all classes
   */
  async findAll(): Promise<Class[]> {
    return this.classModel.find().exec();
  }

  /**
   * Find a class by its ID
   * @param id - The ID of the class to find
   * @returns The found class
   * @throws NotFoundException if the class is not found
   */
  async findById(id: string): Promise<Class> {
    const found = await this.classModel.findById(id).exec();
    if (!found) throw new NotFoundException('Không tìm thấy lớp');
    return found;
  }

  /**
   * Update a class by its ID
   * @param id - The ID of the class to update
   * @param updateClassDto - The data to update the class with
   * @returns The updated class
   * @throws NotFoundException if the class is not found
   */
  async update(id: string, updateClassDto: UpdateClassDto): Promise<Class> {
    const updated = await this.classModel
      .findByIdAndUpdate(
        id,
        { ...updateClassDto, updated_at: new Date() },
        { new: true },
      )
      .exec();
    if (!updated) throw new NotFoundException('Không tìm thấy lớp');
    return updated;
  }

  /**
   * Remove a class by its ID
   * @param id - The ID of the class to remove
   * @throws NotFoundException if the class is not found
   */
  async remove(id: string): Promise<void> {
    const deleted = await this.classModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Không tìm thấy lớp');
  }
}

// Controller
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('classes')
@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  /**
   * Create a new class
   * @param createClassDto - The data to create a new class
   * @returns The created class
   */
  @Post()
  @ApiOperation({ summary: 'Tạo lớp học mới' })
  @ApiResponse({ status: 201, description: 'Lớp học đã được tạo.' })
  async create(@Body() createClassDto: CreateClassDto) {
    return this.classService.create(createClassDto);
  }

  /**
   * Get all classes
   * @returns An array of all classes
   */
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách lớp học' })
  async findAll() {
    return this.classService.findAll();
  }

  /**
   * Get a class by its ID
   * @param id - The ID of the class to find
   * @returns The found class
   */
  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin lớp học theo ID' })
  @ApiParam({ name: 'id', description: 'ID của lớp học' })
  async findOne(@Param('id') id: string) {
    return this.classService.findById(id);
  }

  /**
   * Update a class by its ID
   * @param id - The ID of the class to update
   * @param updateClassDto - The data to update the class with
   * @returns The updated class
   */
  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin lớp học' })
  @ApiParam({ name: 'id', description: 'ID của lớp học' })
  async update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    return this.classService.update(id, updateClassDto);
  }

  /**
   * Remove a class by its ID
   * @param id - The ID of the class to remove
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa lớp học' })
  @ApiParam({ name: 'id', description: 'ID của lớp học' })
  async remove(@Param('id') id: string) {
    return this.classService.remove(id);
  }
}

// Module
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
  ],
  controllers: [ClassController],
  providers: [ClassService],
  exports: [ClassService],
})
export class ClassModule {}
