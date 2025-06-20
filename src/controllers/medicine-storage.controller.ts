import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { MedicineStorageService } from '@/services/medicine-storage.service';
import {
  CreateMedicineStorageDto,
  UpdateMedicineStorageDto,
  UpdateStockDto,
} from '@/decorations/dto/medicine-storage.dto';
import {
  MedicineStorage,
  MedicineStatus,
} from '@/schemas/medicine-storage.schema';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('medicine-storage')
@Controller('medicine-storage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MedicineStorageController {
  constructor(
    private readonly medicineStorageService: MedicineStorageService,
  ) {}

  /**
   * Format the medicine response to return only the necessary fields
   */
  private formatMedicineResponse(medicine: MedicineStorage) {
    if (!medicine) return null;

    const {
      _id,
      name,
      type,
      unit,
      amount_left,
      total,
      status,
      expired,
      description,
      image,
    } = medicine;

    return {
      id: _id,
      name,
      type,
      unit,
      amountLeft: amount_left,
      total,
      status,
      expired,
      description: description || null,
      image: image || null,
      createdAt: medicine['createdAt'],
      updatedAt: medicine['updatedAt'],
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy tất cả các loại thuốc trong kho',
    description: 'Truy xuất tất cả các loại thuốc được lưu trữ trong hệ thống.',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách tất cả các loại thuốc trong kho.',
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
              type: { type: 'string' },
              unit: { type: 'string' },
              amountLeft: { type: 'number' },
              total: { type: 'number' },
              status: {
                type: 'string',
                enum: ['available', 'low', 'out_of_stock'],
              },
              expired: { type: 'string', format: 'date-time' },
              description: { type: 'string', nullable: true },
              image: { type: 'string', nullable: true },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        total: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền truy cập vào tài nguyên này.',
  })
  async findAll() {
    const result = await this.medicineStorageService.findAll();
    return {
      data: result.data.map((medicine) =>
        this.formatMedicineResponse(medicine),
      ),
      total: result.total,
    };
  }

  @Get('expiring')
  @ApiOperation({
    summary: 'Lấy danh sách thuốc sắp hết hạn',
    description:
      'Truy xuất danh sách các loại thuốc sắp hết hạn trong một khoảng thời gian cụ thể.',
  })
  @ApiQuery({
    name: 'days',
    type: Number,
    description: 'Số ngày từ hiện tại đến khi thuốc hết hạn',
    required: false,
    example: 30,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách thuốc sắp hết hạn.',
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
              type: { type: 'string' },
              unit: { type: 'string' },
              amountLeft: { type: 'number' },
              total: { type: 'number' },
              status: {
                type: 'string',
                enum: ['available', 'low', 'out_of_stock'],
              },
              expired: { type: 'string', format: 'date-time' },
              description: { type: 'string', nullable: true },
              image: { type: 'string', nullable: true },
            },
          },
        },
        total: { type: 'number' },
        daysToExpire: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Tham số không hợp lệ.',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền truy cập tài nguyên này.',
  })
  async findExpiring(
    @Query(
      'days',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        optional: true,
      }),
    )
    days?: number,
  ) {
    const daysToExpire = days || 30;

    if (daysToExpire <= 0) {
      throw new BadRequestException('Số ngày phải lớn hơn 0');
    }

    const medicines =
      await this.medicineStorageService.findExpiring(daysToExpire);

    return {
      data: medicines.map((medicine) => this.formatMedicineResponse(medicine)),
      total: medicines.length,
      daysToExpire,
    };
  }

  @Get('low-stock')
  @ApiOperation({
    summary: 'Lấy danh sách thuốc sắp hết hàng',
    description: 'Truy xuất danh sách các loại thuốc có số lượng còn lại thấp.',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách thuốc sắp hết hàng.',
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
              type: { type: 'string' },
              unit: { type: 'string' },
              amountLeft: { type: 'number' },
              total: { type: 'number' },
              status: {
                type: 'string',
                enum: ['available', 'low', 'out_of_stock'],
              },
              expired: { type: 'string', format: 'date-time' },
              description: { type: 'string', nullable: true },
              image: { type: 'string', nullable: true },
            },
          },
        },
        total: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền truy cập tài nguyên này.',
  })
  async findLowStock() {
    const medicines = await this.medicineStorageService.findLowStock();

    return {
      data: medicines.map((medicine) => this.formatMedicineResponse(medicine)),
      total: medicines.length,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin thuốc theo ID',
    description:
      'Truy xuất thông tin chi tiết của một loại thuốc cụ thể theo ID.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID của thuốc cần tìm',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết của thuốc.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        type: { type: 'string' },
        unit: { type: 'string' },
        amountLeft: { type: 'number' },
        total: { type: 'number' },
        status: { type: 'string', enum: ['available', 'low', 'out_of_stock'] },
        expired: { type: 'string', format: 'date-time' },
        description: { type: 'string', nullable: true },
        image: { type: 'string', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy thuốc với ID đã chỉ định.',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền truy cập tài nguyên này.',
  })
  async findOne(@Param('id') id: string) {
    const medicine = await this.medicineStorageService.findById(id);
    return this.formatMedicineResponse(medicine);
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo mới thuốc trong kho',
    description: 'Thêm một loại thuốc mới vào hệ thống kho.',
  })
  @ApiBody({ type: CreateMedicineStorageDto })
  @ApiResponse({
    status: 201,
    description: 'Thuốc đã được tạo thành công.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        type: { type: 'string' },
        unit: { type: 'string' },
        amountLeft: { type: 'number' },
        total: { type: 'number' },
        status: { type: 'string', enum: ['available', 'low', 'out_of_stock'] },
        expired: { type: 'string', format: 'date-time' },
        description: { type: 'string', nullable: true },
        image: { type: 'string', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu đầu vào không hợp lệ.',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền truy cập tài nguyên này.',
  })
  async create(@Body() createMedicineDto: CreateMedicineStorageDto) {
    // Validate amount_left không lớn hơn total
    if (createMedicineDto.amountLeft > createMedicineDto.total) {
      throw new BadRequestException(
        'Số lượng còn lại không thể lớn hơn tổng số lượng',
      );
    }

    // Validate ngày hết hạn không thể trong quá khứ
    const expiredDate = new Date(createMedicineDto.expired);
    const currentDate = new Date();
    if (expiredDate < currentDate) {
      throw new BadRequestException('Ngày hết hạn không thể trong quá khứ');
    }

    // Xác định trạng thái dựa trên số lượng còn lại
    if (createMedicineDto.amountLeft === 0) {
      createMedicineDto.status = MedicineStatus.OUT_OF_STOCK;
    } else if (createMedicineDto.amountLeft < createMedicineDto.total * 0.2) {
      // Low stock khi còn dưới 20%
      createMedicineDto.status = MedicineStatus.LOW;
    } else {
      createMedicineDto.status = MedicineStatus.AVAILABLE;
    }

    const medicine =
      await this.medicineStorageService.create(createMedicineDto);
    return this.formatMedicineResponse(medicine);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật thông tin thuốc',
    description:
      'Cập nhật thông tin chi tiết của một loại thuốc cụ thể theo ID.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID của thuốc cần cập nhật',
    required: true,
  })
  @ApiBody({ type: UpdateMedicineStorageDto })
  @ApiResponse({
    status: 200,
    description: 'Thông tin thuốc đã được cập nhật thành công.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        type: { type: 'string' },
        unit: { type: 'string' },
        amountLeft: { type: 'number' },
        total: { type: 'number' },
        status: { type: 'string', enum: ['available', 'low', 'out_of_stock'] },
        expired: { type: 'string', format: 'date-time' },
        description: { type: 'string', nullable: true },
        image: { type: 'string', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy thuốc với ID đã chỉ định.',
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu đầu vào không hợp lệ.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateMedicineDto: UpdateMedicineStorageDto,
  ) {
    // Kiểm tra xem thuốc có tồn tại không
    const existingMedicine = await this.medicineStorageService.findById(id);

    // Validate amount_left không lớn hơn total
    const newAmountLeft =
      updateMedicineDto.amountLeft ?? existingMedicine.amount_left;
    const newTotal = updateMedicineDto.total ?? existingMedicine.total;

    if (newAmountLeft > newTotal) {
      throw new BadRequestException(
        'Số lượng còn lại không thể lớn hơn tổng số lượng',
      );
    }

    // Validate ngày hết hạn không thể trong quá khứ
    if (updateMedicineDto.expired) {
      const expiredDate = new Date(updateMedicineDto.expired);
      const currentDate = new Date();
      if (expiredDate < currentDate) {
        throw new BadRequestException('Ngày hết hạn không thể trong quá khứ');
      }
    }

    // Xác định trạng thái dựa trên số lượng còn lại
    if (updateMedicineDto.amountLeft !== undefined) {
      if (newAmountLeft === 0) {
        updateMedicineDto.status = MedicineStatus.OUT_OF_STOCK;
      } else if (newAmountLeft < newTotal * 0.2) {
        // Low stock khi còn dưới 20%
        updateMedicineDto.status = MedicineStatus.LOW;
      } else {
        updateMedicineDto.status = MedicineStatus.AVAILABLE;
      }
    }

    const medicine = await this.medicineStorageService.update(
      id,
      updateMedicineDto,
    );
    return this.formatMedicineResponse(medicine);
  }

  @Patch(':id/stock')
  @ApiOperation({
    summary: 'Cập nhật số lượng thuốc',
    description: 'Thêm hoặc bớt số lượng thuốc trong kho.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID của thuốc cần cập nhật số lượng',
    required: true,
  })
  @ApiBody({ type: UpdateStockDto })
  @ApiResponse({
    status: 200,
    description: 'Số lượng thuốc đã được cập nhật thành công.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        type: { type: 'string' },
        unit: { type: 'string' },
        amountLeft: { type: 'number' },
        total: { type: 'number' },
        status: { type: 'string', enum: ['available', 'low', 'out_of_stock'] },
        expired: { type: 'string', format: 'date-time' },
        description: { type: 'string', nullable: true },
        image: { type: 'string', nullable: true },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy thuốc với ID đã chỉ định.',
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu đầu vào không hợp lệ.',
  })
  async updateStock(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    // Kiểm tra xem thuốc có tồn tại không
    const existingMedicine = await this.medicineStorageService.findById(id);

    let newAmountLeft = existingMedicine.amount_left;
    let newTotal = existingMedicine.total;

    // Thực hiện thêm/bớt số lượng
    if (updateStockDto.action === 'add') {
      newAmountLeft += updateStockDto.quantity;
      newTotal += updateStockDto.quantity;
    } else if (updateStockDto.action === 'remove') {
      if (existingMedicine.amount_left < updateStockDto.quantity) {
        throw new BadRequestException(
          'Số lượng lấy ra không thể lớn hơn số lượng hiện có',
        );
      }
      newAmountLeft -= updateStockDto.quantity;
    }

    // Xác định trạng thái mới
    let newStatus: MedicineStatus;
    if (newAmountLeft === 0) {
      newStatus = MedicineStatus.OUT_OF_STOCK;
    } else if (newAmountLeft < newTotal * 0.2) {
      newStatus = MedicineStatus.LOW;
    } else {
      newStatus = MedicineStatus.AVAILABLE;
    }

    // Cập nhật thuốc
    const updateData = {
      amountLeft: newAmountLeft,
      total: newTotal,
      status: newStatus,
    };

    const medicine = await this.medicineStorageService.update(id, updateData);
    return this.formatMedicineResponse(medicine);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Xóa thuốc',
    description: 'Xóa một loại thuốc khỏi hệ thống theo ID.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID của thuốc cần xóa',
    required: true,
  })
  @ApiResponse({
    status: 204,
    description: 'Thuốc đã được xóa thành công.',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy thuốc với ID đã chỉ định.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.medicineStorageService.remove(id);
  }

  @Post('batch')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo nhiều thuốc cùng lúc',
    description:
      'Thêm nhiều loại thuốc mới vào hệ thống kho trong một yêu cầu.',
  })
  @ApiBody({
    type: CreateMedicineStorageDto,
    isArray: true,
    description: 'Danh sách các thuốc cần tạo',
  })
  @ApiResponse({
    status: 201,
    description: 'Các thuốc đã được tạo thành công.',
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
              type: { type: 'string' },
              unit: { type: 'string' },
              amountLeft: { type: 'number' },
              total: { type: 'number' },
              status: {
                type: 'string',
                enum: ['available', 'low', 'out_of_stock'],
              },
              expired: { type: 'string', format: 'date-time' },
              description: { type: 'string', nullable: true },
              image: { type: 'string', nullable: true },
            },
          },
        },
        total: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu đầu vào không hợp lệ.',
  })
  async createMany(@Body() medicines: CreateMedicineStorageDto[]) {
    if (!Array.isArray(medicines) || medicines.length === 0) {
      throw new BadRequestException('Danh sách thuốc không hợp lệ hoặc trống');
    }

    // Validate từng thuốc trong danh sách
    for (const medicine of medicines) {
      if (medicine.amountLeft > medicine.total) {
        throw new BadRequestException(
          `Thuốc ${medicine.name}: Số lượng còn lại không thể lớn hơn tổng số lượng`,
        );
      }

      const expiredDate = new Date(medicine.expired);
      const currentDate = new Date();
      if (expiredDate < currentDate) {
        throw new BadRequestException(
          `Thuốc ${medicine.name}: Ngày hết hạn không thể trong quá khứ`,
        );
      }

      // Xác định trạng thái dựa trên số lượng còn lại
      if (medicine.amountLeft === 0) {
        medicine.status = MedicineStatus.OUT_OF_STOCK;
      } else if (medicine.amountLeft < medicine.total * 0.2) {
        medicine.status = MedicineStatus.LOW;
      } else {
        medicine.status = MedicineStatus.AVAILABLE;
      }
    }

    const createdMedicines =
      await this.medicineStorageService.createMany(medicines);
    return {
      data: createdMedicines.map((medicine) =>
        this.formatMedicineResponse(medicine),
      ),
      total: createdMedicines.length,
    };
  }

  @Delete('batch')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Xóa nhiều thuốc cùng lúc',
    description: 'Xóa nhiều loại thuốc khỏi hệ thống trong một yêu cầu.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'Danh sách ID của các thuốc cần xóa',
        },
      },
    },
  })
  @ApiResponse({
    status: 204,
    description: 'Các thuốc đã được xóa thành công.',
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu đầu vào không hợp lệ.',
  })
  async removeMany(@Body('ids') ids: string[]): Promise<void> {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('Mảng ID không hợp lệ hoặc trống');
    }
    await this.medicineStorageService.removeMany(ids);
  }
}
