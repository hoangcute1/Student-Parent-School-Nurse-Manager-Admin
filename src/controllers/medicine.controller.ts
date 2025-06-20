import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { MedicineService } from '@/services/medicine.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CreateMedicineDto } from '@/decorations/dto/create-medicine.dto';
import { UpdateMedicineDto } from '@/decorations/dto/update-medicine.dto';
import { FilterMedicineWithPaginationDto } from '@/decorations/dto/filter-medicine.dto';
import { MedicineType, MedicineUnit } from '@/schemas/medicine.schema';

@ApiTags('medicines')
@Controller('medicines')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all medicines with optional filters and pagination',
  })
  @ApiOkResponse({
    description: 'Returns all medicines matching the filters with pagination',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              dosage: { type: 'string' },
              unit: { type: 'string', enum: Object.values(MedicineUnit) },
              type: { type: 'string', enum: Object.values(MedicineType) },
              description: { type: 'string' },
              is_prescription_required: { type: 'boolean' },
            },
          },
        },
        meta: {
          type: 'object',
          properties: {
            totalItems: { type: 'number' },
            itemsPerPage: { type: 'number' },
            totalPages: { type: 'number' },
            currentPage: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async findAll(@Query() filterDto: FilterMedicineWithPaginationDto) {
    return this.medicineService.findAll(filterDto);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Search medicines by name, description, or manufacturer',
  })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Search term (case insensitive)',
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (1-based)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    type: Number,
  })
  @ApiOkResponse({
    description:
      'Returns all medicines matching the search term with pagination',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              dosage: { type: 'string' },
              unit: { type: 'string', enum: Object.values(MedicineUnit) },
              type: { type: 'string', enum: Object.values(MedicineType) },
              description: { type: 'string' },
              is_prescription_required: { type: 'boolean' },
            },
          },
        },
        meta: {
          type: 'object',
          properties: {
            totalItems: { type: 'number' },
            itemsPerPage: { type: 'number' },
            totalPages: { type: 'number' },
            currentPage: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async search(
    @Query('q') searchTerm: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.medicineService.search(searchTerm, page, limit);
  }

  @Get('type/:type')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all medicines of a specific type with pagination',
  })
  @ApiParam({
    name: 'type',
    description: 'Type of medicine',
    enum: MedicineType,
    required: true,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (1-based)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    type: Number,
  })
  @ApiOkResponse({
    description: 'Returns all medicines of the specified type with pagination',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              dosage: { type: 'string' },
              unit: { type: 'string', enum: Object.values(MedicineUnit) },
              type: { type: 'string', enum: Object.values(MedicineType) },
              description: { type: 'string' },
              is_prescription_required: { type: 'boolean' },
            },
          },
        },
        meta: {
          type: 'object',
          properties: {
            totalItems: { type: 'number' },
            itemsPerPage: { type: 'number' },
            totalPages: { type: 'number' },
            currentPage: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async findByType(
    @Param('type') type: MedicineType,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.medicineService.findByType(type, page, limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a medicine by ID' })
  @ApiParam({ name: 'id', description: 'Medicine ID' })
  @ApiOkResponse({
    description: 'Returns the medicine',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        dosage: { type: 'string' },
        unit: { type: 'string', enum: Object.values(MedicineUnit) },
        type: { type: 'string', enum: Object.values(MedicineType) },
        usage_instructions: { type: 'string', nullable: true },
        side_effects: { type: 'string', nullable: true },
        contraindications: { type: 'string', nullable: true },
        description: { type: 'string' },
        image: { type: 'string', nullable: true },
        is_prescription_required: { type: 'boolean' },
        manufacturer: { type: 'string', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid ID format' })
  @ApiNotFoundResponse({ description: 'Medicine not found' })
  async findOne(@Param('id') id: string) {
    return this.medicineService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new medicine' })
  @ApiBody({ type: CreateMedicineDto })
  @ApiCreatedResponse({
    description: 'The medicine has been successfully created',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        dosage: { type: 'string' },
        unit: { type: 'string', enum: Object.values(MedicineUnit) },
        type: { type: 'string', enum: Object.values(MedicineType) },
        description: { type: 'string' },
        is_prescription_required: { type: 'boolean' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  async create(@Body() createMedicineDto: CreateMedicineDto) {
    return this.medicineService.create(createMedicineDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a medicine by ID' })
  @ApiParam({ name: 'id', description: 'Medicine ID' })
  @ApiBody({ type: UpdateMedicineDto })
  @ApiOkResponse({
    description: 'The medicine has been successfully updated',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        dosage: { type: 'string' },
        unit: { type: 'string', enum: Object.values(MedicineUnit) },
        type: { type: 'string', enum: Object.values(MedicineType) },
        description: { type: 'string' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID format or validation failed',
  })
  @ApiNotFoundResponse({ description: 'Medicine not found' })
  async update(
    @Param('id') id: string,
    @Body() updateMedicineDto: UpdateMedicineDto,
  ) {
    return this.medicineService.update(id, updateMedicineDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a medicine by ID' })
  @ApiParam({ name: 'id', description: 'Medicine ID' })
  @ApiOkResponse({
    description: 'The medicine has been successfully deleted',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        deleted: { type: 'boolean' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid ID format' })
  @ApiNotFoundResponse({ description: 'Medicine not found' })
  async remove(@Param('id') id: string) {
    return this.medicineService.remove(id);
  }
}
