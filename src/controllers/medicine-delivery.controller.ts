import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Put,
} from '@nestjs/common';
import { MedicineDeliveryService } from '@/services/medicine-delivery.service';
import {
  CreateMedicineDeliveryDto,
  UpdateMedicineDeliveryDto,
  DateRangeDto,
} from '@/decorations/dto/medicine-delivery.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { MedicineDelivery, MedicineDeliveryStatus } from '@/schemas/medicine-delivery.schema';
import { GetUser } from '@/decorations/get-user.decorator';

@ApiTags('medicine-deliveries')
@Controller('medicine-deliveries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MedicineDeliveryController {
  constructor(private readonly medicineDeliveryService: MedicineDeliveryService) {}
  private formatDeliveryResponse(delivery: MedicineDelivery) {
    if (!delivery) return null;

    // Basic delivery information
    const result: any = {
      id: delivery._id?.toString(),
      name: delivery.name,
      date: delivery.date,
      total: delivery.total,
      status: delivery.status,
      per_dose: delivery.per_dose,
      per_day: delivery.per_day,
      note: delivery.note || null,
      reason: delivery.reason,
      sent_at: delivery.sent_at,
      end_at: delivery.end_at,
      created_at: delivery['createdAt'],
      updated_at: delivery['updatedAt'],
    };

    // Format student if populated
    if (delivery.student && typeof delivery.student === 'object') {
      const student = delivery.student as any;
      result.student = {
        id: student._id?.toString() || '',
        name: student.name || '',
        studentId: student.studentId || '',
      };

      // Add class information if available
      if (student.class && typeof student.class === 'object') {
        result.student.class = {
          id: student.class._id?.toString() || '',
          name: student.class.name || '',
        };
      }
    } else if (delivery.student) {
      // If student is just an ID (string or ObjectId)
      result.student = { id: String(delivery.student) };
    } else {
      result.student = null;
    }

    // Format staff if populated
    if (delivery.staff && typeof delivery.staff === 'object') {
      const staff = delivery.staff as any;
      result.staff = {
        id: staff._id?.toString() || '',
        name: staff.name || '',
        ...(staff.email && { email: staff.email }),
        ...(staff.role && { role: staff.role }),
      };
    } else if (delivery.staff) {
      // If staff is just an ID
      result.staff = { id: String(delivery.staff) };
    } else {
      result.staff = null;
    }

    // Format medicine if populated
    if (delivery.medicine && typeof delivery.medicine === 'object') {
      const medicine = delivery.medicine as any;
      result.medicine = {
        id: medicine._id?.toString() || '',
        name: medicine.name || '',
        ...(medicine.dosage && { dosage: medicine.dosage }),
        ...(medicine.unit && { unit: medicine.unit }),
        ...(medicine.type && { type: medicine.type }),
      };
    } else if (delivery.medicine) {
      // If medicine is just an ID
      result.medicine = { id: String(delivery.medicine) };
    } else {
      result.medicine = null;
    }

    return result;
  }

  /**
   * Create a new medicine delivery
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new medicine delivery',
    description: 'Create a new medicine delivery schedule for a student',
  })
  @ApiBody({ type: CreateMedicineDeliveryDto })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Body() createMedicineDeliveryDto: CreateMedicineDeliveryDto) {
    return this.medicineDeliveryService.create(createMedicineDeliveryDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all medicine deliveries',
    description: 'Get a list of all medicine deliveries with optional filters',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll() {
    return this.medicineDeliveryService.findAll();
  }

  @Get('parent/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get medicine deliveries by userId',
    description: 'Get all medicine deliveries for a specific parent',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Parent not found.' })
  async findByParent(@Param('userId') userId: string) {
    return this.medicineDeliveryService.findByUserId(userId);
  }

  @Get('staff/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get medicine deliveries by userId',
    description: 'Get all medicine deliveries for a specific parent',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Parent not found.' })
  async findbyStaff(@Param('userId') userId: string) {
    return this.medicineDeliveryService.findByUserStaff(userId);
  }

  /**
   * Get deliveries for a student
   */
  @Get('student/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get deliveries for a student',
    description: 'Get all medicine deliveries for a specific student',
  })
  @ApiParam({
    name: 'id',
    description: 'Student ID',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: MedicineDeliveryStatus,
    description: 'Filter by status',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  async findByStudent(@Param('id') id: string, @Query('status') status?: MedicineDeliveryStatus) {
    try {
      const deliveries = await this.medicineDeliveryService.findByStudent(id, status);
      return {
        data: deliveries.map((delivery) => this.formatDeliveryResponse(delivery)),
        total: deliveries.length,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error fetching deliveries for student: ${error.message}`);
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get a medicine delivery',
    description: 'Get details of a specific medicine delivery by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Medicine delivery ID',
    type: String,
    required: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Medicine delivery not found.' })
  async findOne(@Param('id') id: string) {
    try {
      const delivery = await this.medicineDeliveryService.findById(id);
      if (!delivery) {
        throw new NotFoundException(`Medicine delivery with ID ${id} not found`);
      }
      const formattedDelivery = this.formatDeliveryResponse(delivery.delivery);
      return {
        ...formattedDelivery,
        staffName: delivery.staffName || null,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error fetching medicine delivery: ${error.message}`);
    }
  }

  /**
   * Update a medicine delivery
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a medicine delivery',
    description: 'Update details of a specific medicine delivery by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Medicine delivery ID',
    type: String,
    required: true,
  })
  @ApiBody({ type: UpdateMedicineDeliveryDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Cannot update completed or cancelled deliveries.' })
  @ApiResponse({ status: 404, description: 'Medicine delivery not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateMedicineDeliveryDto: UpdateMedicineDeliveryDto,
    @GetUser() user: any,
  ) {
    try {
      // Check if delivery exists and get current state
      const current = await this.medicineDeliveryService.findById(id);

      // Check if delivery can be updated based on status
      if (
        [MedicineDeliveryStatus.COMPLETED, MedicineDeliveryStatus.CANCELLED].includes(
          current.delivery.status,
        )
      ) {
        throw new ForbiddenException(`Cannot update delivery in ${current.delivery.status} status`);
      }

      // Validate dates if they are being updated
      if (updateMedicineDeliveryDto.sent_at || updateMedicineDeliveryDto.end_at) {
        const sentAt = new Date(updateMedicineDeliveryDto.sent_at || current.delivery.sent_at);
        const endAt = new Date(updateMedicineDeliveryDto.end_at || current.delivery.end_at);

        // Validate date formats
        if (isNaN(sentAt.getTime()) || isNaN(endAt.getTime())) {
          throw new BadRequestException('Invalid date format');
        }

        // Validate date logic
        if (endAt <= sentAt) {
          throw new BadRequestException('End date must be after start date');
        }

        // Update the dates in DTO
        updateMedicineDeliveryDto.sent_at = sentAt;
        updateMedicineDeliveryDto.end_at = endAt;
      }

      // Perform update
      const updatedDelivery = await this.medicineDeliveryService.update(
        id,
        updateMedicineDeliveryDto,
      );

      // Return formatted response
      return this.formatDeliveryResponse(updatedDelivery);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof ForbiddenException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error updating medicine delivery: ${error.message}`);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a medicine delivery',
    description: 'Delete a medicine delivery that is not yet approved or completed',
  })
  @ApiParam({
    name: 'id',
    description: 'Medicine delivery ID',
    type: String,
    required: true,
  })
  @ApiNoContentResponse({
    description: 'The medicine delivery has been successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Medicine delivery not found.' })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete approved or completed deliveries.',
  })
  async remove(@Param('id') id: string) {
    try {
      // Check if delivery exists and can be deleted
      const current = await this.medicineDeliveryService.findById(id);

      await this.medicineDeliveryService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException(`Error deleting medicine delivery: ${error.message}`);
    }
  }

  /**
   * Get deliveries for a staff
   */

  @Patch(':id/soft-delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Soft delete a medicine delivery (hide from admin/staff view)',
    description:
      'Hide a medicine delivery from admin/staff view while keeping it visible to parents',
  })
  @ApiParam({
    name: 'id',
    description: 'Medicine delivery ID',
    type: String,
    required: true,
  })
  @ApiNoContentResponse({
    description: 'The medicine delivery has been successfully hidden from admin/staff view.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Medicine delivery not found.' })
  async softDelete(@Param('id') id: string, @GetUser() user: any) {
    try {
      // Check if delivery exists
      const delivery = await this.medicineDeliveryService.findById(id);

      // Add the current user (admin/staff) to a hidden list or mark as hidden for staff
      await this.medicineDeliveryService.softDelete(id, user.id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error hiding medicine delivery: ${error.message}`);
    }
  }

  /**
   * Get deliveries for a staff
   */
}
