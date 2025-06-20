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
} from '@nestjs/common';
import { MedicineDeliveryService } from '@/services/medicine-delivery.service';
import {
  CreateMedicineDeliveryDto,
  UpdateMedicineDeliveryDto,
  ApproveRejectDeliveryDto,
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
import {
  MedicineDelivery,
  MedicineDeliveryStatus,
} from '@/schemas/medicine-delivery.schema';
import { GetUser } from '@/decorations/get-user.decorator';

@ApiTags('medicine-deliveries')
@Controller('medicine-deliveries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MedicineDeliveryController {
  constructor(
    private readonly medicineDeliveryService: MedicineDeliveryService,
  ) {}

  /**
   * Format medicine delivery response to standardize the output
   * and handle MongoDB document references
   */
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
  @ApiCreatedResponse({
    description: 'The medicine delivery has been successfully created.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        date: { type: 'string', format: 'date-time' },
        total: { type: 'number' },
        status: {
          type: 'string',
          enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
        },
        per_dose: { type: 'string' },
        per_day: { type: 'string' },
        note: { type: 'string', nullable: true },
        reason: { type: 'string' },
        sent_at: { type: 'string', format: 'date-time' },
        end_at: { type: 'string', format: 'date-time' },
        student: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            studentId: { type: 'string' },
          },
        },
        staff: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
        },
        medicine: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
        },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(
    @Body() createMedicineDeliveryDto: CreateMedicineDeliveryDto,
    @GetUser() user: any,
  ) {
    try {
      // Validate dates
      const endAt = new Date(createMedicineDeliveryDto.end_at);
      const now = new Date();

      if (isNaN(endAt.getTime())) {
        throw new BadRequestException('Invalid date format');
      }

      // If sent_at is provided, validate it, otherwise use current time
      if (createMedicineDeliveryDto.sent_at) {
        const sentAt = new Date(createMedicineDeliveryDto.sent_at);
        if (isNaN(sentAt.getTime())) {
          throw new BadRequestException('Invalid sent_at date format');
        }

        // Don't check if sent_at is in the past, it's allowed for backdating purposes

        if (endAt <= sentAt) {
          throw new BadRequestException('End date must be after start date');
        }
      } else {
        // If not provided, sent_at will use the default Date.now from schema
      }

      if (endAt <= now) {
        throw new BadRequestException('End date must be in the future');
      }

      // Set default status to pending
      createMedicineDeliveryDto.status = MedicineDeliveryStatus.PENDING;

      // Set staff to current user if not provided
      if (!createMedicineDeliveryDto.staff) {
        createMedicineDeliveryDto.staff = user.userId;
      }

      const delivery = await this.medicineDeliveryService.create(
        createMedicineDeliveryDto,
      );
      return this.formatDeliveryResponse(delivery);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Error creating medicine delivery: ${error.message}`,
      );
    }
  }

  /**
   * Get all medicine deliveries with optional filters
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all medicine deliveries',
    description: 'Get a list of all medicine deliveries with optional filters',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: MedicineDeliveryStatus,
    description: 'Filter by status',
  })
  @ApiQuery({
    name: 'from',
    required: false,
    type: String,
    description: 'Filter from date (ISO format)',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: String,
    description: 'Filter to date (ISO format)',
  })
  @ApiOkResponse({
    description: 'List of medicine deliveries.',
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
              date: { type: 'string', format: 'date-time' },
              total: { type: 'number' },
              status: {
                type: 'string',
                enum: [
                  'pending',
                  'approved',
                  'rejected',
                  'completed',
                  'cancelled',
                ],
              },
              student: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  studentId: { type: 'string' },
                },
              },
              medicine: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
        total: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(
    @Query('status') status?: MedicineDeliveryStatus,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    try {
      // Validate dates if provided
      if (from && to) {
        const fromDate = new Date(from);
        const toDate = new Date(to);

        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
          throw new BadRequestException('Invalid date format');
        }

        if (toDate < fromDate) {
          throw new BadRequestException('End date must be after start date');
        }
      }

      const result = await this.medicineDeliveryService.findAll({
        status,
        from,
        to,
      });

      return {
        data: result.data.map((delivery) =>
          this.formatDeliveryResponse(delivery),
        ),
        total: result.total,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Error fetching medicine deliveries: ${error.message}`,
      );
    }
  }

  /**
   * Get deliveries by status
   */
  @Get('status/:status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get deliveries by status',
    description: 'Get all medicine deliveries with a specific status',
  })
  @ApiParam({
    name: 'status',
    description: 'Status of the deliveries',
    enum: MedicineDeliveryStatus,
    required: true,
  })
  @ApiOkResponse({
    description: 'List of medicine deliveries with the specified status.',
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
              date: { type: 'string', format: 'date-time' },
              status: { type: 'string' },
              student: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  studentId: { type: 'string' },
                },
              },
            },
          },
        },
        total: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Invalid status.' })
  async findByStatus(@Param('status') status: MedicineDeliveryStatus) {
    // Validate status
    if (!Object.values(MedicineDeliveryStatus).includes(status)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    try {
      const deliveries =
        await this.medicineDeliveryService.findByStatus(status);
      return {
        data: deliveries.map((delivery) =>
          this.formatDeliveryResponse(delivery),
        ),
        total: deliveries.length,
      };
    } catch (error) {
      throw new BadRequestException(
        `Error fetching deliveries by status: ${error.message}`,
      );
    }
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
  @ApiOkResponse({
    description: 'List of medicine deliveries for the student.',
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
              date: { type: 'string', format: 'date-time' },
              total: { type: 'number' },
              status: {
                type: 'string',
                enum: [
                  'pending',
                  'approved',
                  'rejected',
                  'completed',
                  'cancelled',
                ],
              },
              per_dose: { type: 'string' },
              per_day: { type: 'string' },
              medicine: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
        total: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  async findByStudent(
    @Param('id') id: string,
    @Query('status') status?: MedicineDeliveryStatus,
  ) {
    try {
      const deliveries = await this.medicineDeliveryService.findByStudent(
        id,
        status,
      );
      return {
        data: deliveries.map((delivery) =>
          this.formatDeliveryResponse(delivery),
        ),
        total: deliveries.length,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Error fetching deliveries for student: ${error.message}`,
      );
    }
  }

  /**
   * Get deliveries in a date range
   */
  @Get('date-range')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get deliveries in a date range',
    description: 'Get all medicine deliveries within a specific date range',
  })
  @ApiQuery({
    name: 'from',
    required: true,
    type: String,
    description: 'Start date (ISO format)',
  })
  @ApiQuery({
    name: 'to',
    required: true,
    type: String,
    description: 'End date (ISO format)',
  })
  @ApiOkResponse({
    description: 'List of medicine deliveries in the date range.',
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
              date: { type: 'string', format: 'date-time' },
              status: { type: 'string' },
              student: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  studentId: { type: 'string' },
                },
              },
              medicine: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
        total: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Invalid date range.' })
  async findByDateRange(@Query() dateRange: DateRangeDto) {
    // Validate date range
    const from = new Date(dateRange.from);
    const to = new Date(dateRange.to);

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    if (to < from) {
      throw new BadRequestException('End date must be after start date');
    }

    try {
      const deliveries = await this.medicineDeliveryService.findByDateRange(
        from,
        to,
      );
      return {
        data: deliveries.map((delivery) =>
          this.formatDeliveryResponse(delivery),
        ),
        total: deliveries.length,
      };
    } catch (error) {
      throw new BadRequestException(
        `Error fetching deliveries in date range: ${error.message}`,
      );
    }
  }

  /**
   * Get today's deliveries
   */
  @Get('today')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get today's deliveries",
    description: 'Get all medicine deliveries scheduled for today',
  })
  @ApiOkResponse({
    description: 'List of medicine deliveries for today.',
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
              date: { type: 'string', format: 'date-time' },
              status: { type: 'string' },
              student: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  studentId: { type: 'string' },
                },
              },
            },
          },
        },
        total: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findToday() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const deliveries = await this.medicineDeliveryService.findByDateRange(
        today,
        tomorrow,
      );

      return {
        data: deliveries.map((delivery) =>
          this.formatDeliveryResponse(delivery),
        ),
        total: deliveries.length,
      };
    } catch (error) {
      throw new BadRequestException(
        `Error fetching today's deliveries: ${error.message}`,
      );
    }
  }

  /**
   * Get pending deliveries
   */
  @Get('pending')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get pending deliveries',
    description: 'Get all medicine deliveries with pending status',
  })
  @ApiOkResponse({
    description: 'List of pending medicine deliveries.',
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
              date: { type: 'string', format: 'date-time' },
              student: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  studentId: { type: 'string' },
                },
              },
            },
          },
        },
        total: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findPending() {
    try {
      const deliveries = await this.medicineDeliveryService.findByStatus(
        MedicineDeliveryStatus.PENDING,
      );

      return {
        data: deliveries.map((delivery) =>
          this.formatDeliveryResponse(delivery),
        ),
        total: deliveries.length,
      };
    } catch (error) {
      throw new BadRequestException(
        `Error fetching pending deliveries: ${error.message}`,
      );
    }
  }

  /**
   * Get a specific medicine delivery by ID
   */
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
  @ApiOkResponse({
    description: 'The medicine delivery details.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        date: { type: 'string', format: 'date-time' },
        total: { type: 'number' },
        status: {
          type: 'string',
          enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
        },
        per_dose: { type: 'string' },
        per_day: { type: 'string' },
        note: { type: 'string', nullable: true },
        reason: { type: 'string' },
        sent_at: { type: 'string', format: 'date-time' },
        end_at: { type: 'string', format: 'date-time' },
        student: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            studentId: { type: 'string' },
          },
        },
        staff: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
        },
        medicine: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
        },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Medicine delivery not found.' })
  async findOne(@Param('id') id: string) {
    try {
      const delivery = await this.medicineDeliveryService.findById(id);
      if (!delivery) {
        throw new NotFoundException(
          `Medicine delivery with ID ${id} not found`,
        );
      }
      return this.formatDeliveryResponse(delivery);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Error fetching medicine delivery: ${error.message}`,
      );
    }
  }

  /**
   * Update a medicine delivery
   */
  @Patch(':id')
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
  @ApiOkResponse({
    description: 'The medicine delivery has been successfully updated.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        status: { type: 'string' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Medicine delivery not found.' })
  @ApiResponse({
    status: 400,
    description: 'Cannot update completed or cancelled deliveries.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateMedicineDeliveryDto: UpdateMedicineDeliveryDto,
  ) {
    try {
      // Get current delivery
      const current = await this.medicineDeliveryService.findById(id);

      // Check if delivery can be updated
      if (
        [
          MedicineDeliveryStatus.COMPLETED,
          MedicineDeliveryStatus.CANCELLED,
        ].includes(current.status)
      ) {
        throw new ForbiddenException(
          `Cannot update delivery in ${current.status} status`,
        );
      }

      // Validate date logic if dates are being updated
      if (
        updateMedicineDeliveryDto.sent_at ||
        updateMedicineDeliveryDto.end_at
      ) {
        const sentAt = updateMedicineDeliveryDto.sent_at
          ? new Date(updateMedicineDeliveryDto.sent_at)
          : current.sent_at;

        const endAt = updateMedicineDeliveryDto.end_at
          ? new Date(updateMedicineDeliveryDto.end_at)
          : current.end_at;

        const now = new Date();

        if (isNaN(sentAt.getTime()) || isNaN(endAt.getTime())) {
          throw new BadRequestException('Invalid date format');
        }

        // We don't check if sent_at is in the past since it could be legitimate for backdating

        if (endAt <= sentAt) {
          throw new BadRequestException('End date must be after start date');
        }
      }

      // Validate status changes
      if (updateMedicineDeliveryDto.status) {
        if (
          updateMedicineDeliveryDto.status ===
            MedicineDeliveryStatus.COMPLETED &&
          current.status !== MedicineDeliveryStatus.APPROVED
        ) {
          throw new BadRequestException(
            'Only approved deliveries can be completed',
          );
        }
      }

      const delivery = await this.medicineDeliveryService.update(
        id,
        updateMedicineDeliveryDto,
      );

      return this.formatDeliveryResponse(delivery);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Error updating medicine delivery: ${error.message}`,
      );
    }
  }

  /**
   * Approve or reject a medicine delivery
   */
  @Patch(':id/approve-reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Approve or reject a medicine delivery',
    description: 'Approve or reject a pending medicine delivery request',
  })
  @ApiParam({
    name: 'id',
    description: 'Medicine delivery ID',
    type: String,
    required: true,
  })
  @ApiBody({ type: ApproveRejectDeliveryDto })
  @ApiOkResponse({
    description:
      'The medicine delivery has been successfully approved or rejected.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        status: { type: 'string', enum: ['approved', 'rejected'] },
        note: { type: 'string', nullable: true },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Medicine delivery not found.' })
  @ApiResponse({
    status: 400,
    description: 'Can only approve or reject pending deliveries.',
  })
  async approveOrReject(
    @Param('id') id: string,
    @Body() dto: ApproveRejectDeliveryDto,
    @GetUser() user: any,
  ) {
    try {
      // Validate the delivery exists and is in pending status
      const current = await this.medicineDeliveryService.findById(id);

      if (current.status !== MedicineDeliveryStatus.PENDING) {
        throw new BadRequestException(
          'Can only approve or reject pending deliveries',
        );
      }

      const delivery = await this.medicineDeliveryService.approveOrReject(
        id,
        dto,
        user.userId,
      );

      return {
        id: delivery._id,
        status: delivery.status,
        note: delivery.note,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Error approving/rejecting delivery: ${error.message}`,
      );
    }
  }

  /**
   * Mark a medicine delivery as completed
   */
  @Patch(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mark a medicine delivery as completed',
    description: 'Mark an approved medicine delivery as completed',
  })
  @ApiParam({
    name: 'id',
    description: 'Medicine delivery ID',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    description: 'The medicine delivery has been successfully completed.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        status: { type: 'string', enum: ['completed'] },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Medicine delivery not found.' })
  @ApiResponse({
    status: 400,
    description: 'Can only complete approved deliveries.',
  })
  async complete(@Param('id') id: string) {
    try {
      // Validate the delivery exists and is in approved status
      const current = await this.medicineDeliveryService.findById(id);

      if (current.status !== MedicineDeliveryStatus.APPROVED) {
        throw new BadRequestException('Can only complete approved deliveries');
      }

      const delivery = await this.medicineDeliveryService.complete(id);

      return {
        id: delivery._id,
        status: delivery.status,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Error completing delivery: ${error.message}`,
      );
    }
  }

  /**
   * Cancel a medicine delivery
   */
  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cancel a medicine delivery',
    description: 'Cancel a medicine delivery that is not yet completed',
  })
  @ApiParam({
    name: 'id',
    description: 'Medicine delivery ID',
    type: String,
    required: true,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        note: { type: 'string', description: 'Reason for cancellation' },
      },
    },
  })
  @ApiOkResponse({
    description: 'The medicine delivery has been successfully cancelled.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        status: { type: 'string', enum: ['cancelled'] },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Medicine delivery not found.' })
  @ApiResponse({
    status: 400,
    description: 'Cannot cancel completed deliveries.',
  })
  async cancel(@Param('id') id: string, @Body('note') note?: string) {
    try {
      // Validate the delivery exists and is not completed
      const current = await this.medicineDeliveryService.findById(id);

      if (current.status === MedicineDeliveryStatus.COMPLETED) {
        throw new BadRequestException('Cannot cancel completed deliveries');
      }

      const delivery = await this.medicineDeliveryService.cancel(id, note);

      return {
        id: delivery._id,
        status: delivery.status,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Error cancelling delivery: ${error.message}`,
      );
    }
  }

  /**
   * Delete a medicine delivery
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a medicine delivery',
    description:
      'Delete a medicine delivery that is not yet approved or completed',
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

      if (
        [
          MedicineDeliveryStatus.APPROVED,
          MedicineDeliveryStatus.COMPLETED,
        ].includes(current.status)
      ) {
        throw new ForbiddenException(
          `Cannot delete delivery in ${current.status} status`,
        );
      }

      await this.medicineDeliveryService.remove(id);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Error deleting medicine delivery: ${error.message}`,
      );
    }
  }
}
