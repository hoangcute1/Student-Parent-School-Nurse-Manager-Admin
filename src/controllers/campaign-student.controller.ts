import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
  Patch,
} from '@nestjs/common';
import { CampaignStudentService } from '@/services/campaign-student.service';
import { CreateCampaignStudentDto } from '@/decorations/dto/create-campaign-student.dto';
import { UpdateCampaignStudentDto } from '@/decorations/dto/update-campaign-student.dto';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { SuccessResponseDto } from '@/decorations/dto/success-response.dto';
import { PaginatedResponseDto } from '@/decorations/dto/paginated-response.dto';
import { StudentCampaignStatus } from '@/enums/campaign.enum';

@ApiTags('campaign-student')
@Controller('campaign-student')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CampaignStudentController {
  constructor(
    private readonly campaignStudentService: CampaignStudentService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new campaign-student association' })
  @ApiBody({
    type: CreateCampaignStudentDto,
    description: 'Campaign-Student association data',
  })
  @ApiResponse({
    status: 201,
    description:
      'The campaign-student association has been successfully created',
    type: SuccessResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Association already exists' })
  async create(@Body() createCampaignStudentDto: CreateCampaignStudentDto) {
    const result = await this.campaignStudentService.create(
      createCampaignStudentDto,
    );
    return new SuccessResponseDto(
      'Campaign-Student association created successfully',
      result,
    );
  }

  @Post('batch')
  @ApiOperation({ summary: 'Batch create campaign-student associations' })
  @ApiBody({
    type: [CreateCampaignStudentDto],
    description: 'Array of Campaign-Student associations data',
  })
  @ApiResponse({
    status: 201,
    description:
      'The campaign-student associations have been successfully created',
    type: SuccessResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async batchCreate(
    @Body() createCampaignStudentDtos: CreateCampaignStudentDto[],
  ) {
    const result = await this.campaignStudentService.batchCreate(
      createCampaignStudentDtos,
    );
    return new SuccessResponseDto(
      `${result.created} Campaign-Student associations created successfully`,
      result,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all campaign-student associations' })
  @ApiResponse({
    status: 200,
    description: 'List of all campaign-student associations',
    type: PaginatedResponseDto,
  })
  async findAll() {
    const results = await this.campaignStudentService.findAll();
    return new PaginatedResponseDto(
      results,
      {
        page: 1,
        limit: results.length,
        totalItems: results.length,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
      'Campaign-Student associations retrieved successfully',
    );
  }

  @Get('class-campaign/:classCampaignId')
  @ApiOperation({
    summary: 'Get campaign-student associations by class campaign ID',
  })
  @ApiParam({ name: 'classCampaignId', description: 'Class Campaign ID' })
  @ApiResponse({
    status: 200,
    description:
      'List of campaign-student associations for the specified class campaign',
    type: PaginatedResponseDto,
  })
  async findByClassCampaign(@Param('classCampaignId') classCampaignId: string) {
    const results =
      await this.campaignStudentService.findByClassCampaign(classCampaignId);
    return new PaginatedResponseDto(
      results,
      {
        page: 1,
        limit: results.length,
        totalItems: results.length,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
      'Campaign-Student associations for class campaign retrieved successfully',
    );
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get campaign-student associations by student ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description:
      'List of campaign-student associations for the specified student',
    type: PaginatedResponseDto,
  })
  async findByStudent(@Param('studentId') studentId: string) {
    const results = await this.campaignStudentService.findByStudent(studentId);
    return new PaginatedResponseDto(
      results,
      {
        page: 1,
        limit: results.length,
        totalItems: results.length,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
      'Campaign-Student associations for student retrieved successfully',
    );
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get campaign-student associations by status' })
  @ApiParam({
    name: 'status',
    description: 'Status',
    enum: StudentCampaignStatus,
  })
  @ApiResponse({
    status: 200,
    description:
      'List of campaign-student associations with the specified status',
    type: PaginatedResponseDto,
  })
  async findByStatus(@Param('status') status: string) {
    const results = await this.campaignStudentService.findByStatus(status);
    return new PaginatedResponseDto(
      results,
      {
        page: 1,
        limit: results.length,
        totalItems: results.length,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
      'Campaign-Student associations with status retrieved successfully',
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a campaign-student association by ID' })
  @ApiParam({ name: 'id', description: 'Campaign-Student association ID' })
  @ApiResponse({
    status: 200,
    description: 'Campaign-Student association details',
    type: SuccessResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Association not found' })
  async findOne(@Param('id') id: string) {
    const result = await this.campaignStudentService.findById(id);
    return new SuccessResponseDto(
      'Campaign-Student association retrieved successfully',
      result,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a campaign-student association' })
  @ApiParam({ name: 'id', description: 'Campaign-Student association ID' })
  @ApiBody({
    type: UpdateCampaignStudentDto,
    description: 'Updated campaign-student association data',
  })
  @ApiResponse({
    status: 200,
    description:
      'The campaign-student association has been successfully updated',
    type: SuccessResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Association not found' })
  async update(
    @Param('id') id: string,
    @Body() updateCampaignStudentDto: UpdateCampaignStudentDto,
  ) {
    const result = await this.campaignStudentService.update(
      id,
      updateCampaignStudentDto,
    );
    return new SuccessResponseDto(
      'Campaign-Student association updated successfully',
      result,
    );
  }

  @Patch(':id/status/:status')
  @ApiOperation({ summary: 'Update status of a campaign-student association' })
  @ApiParam({ name: 'id', description: 'Campaign-Student association ID' })
  @ApiParam({
    name: 'status',
    description: 'New status',
    enum: StudentCampaignStatus,
  })
  @ApiResponse({
    status: 200,
    description: 'The campaign-student status has been successfully updated',
    type: SuccessResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Association not found' })
  async updateStatus(@Param('id') id: string, @Param('status') status: string) {
    const result = await this.campaignStudentService.updateStatus(id, status);
    return new SuccessResponseDto(
      'Campaign-Student status updated successfully',
      result,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a campaign-student association' })
  @ApiParam({ name: 'id', description: 'Campaign-Student association ID' })
  @ApiResponse({
    status: 200,
    description:
      'The campaign-student association has been successfully deleted',
    type: SuccessResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Association not found' })
  async remove(@Param('id') id: string) {
    const result = await this.campaignStudentService.remove(id);
    return new SuccessResponseDto(
      'Campaign-Student association deleted successfully',
      result,
    );
  }

  @Delete('class-campaign/:classCampaignId')
  @ApiOperation({
    summary: 'Delete all campaign-student associations for a class campaign',
  })
  @ApiParam({ name: 'classCampaignId', description: 'Class Campaign ID' })
  @ApiResponse({
    status: 200,
    description:
      'All campaign-student associations for the class campaign have been deleted',
    type: SuccessResponseDto,
  })
  async removeByClassCampaign(
    @Param('classCampaignId') classCampaignId: string,
  ) {
    const result =
      await this.campaignStudentService.removeByClassCampaign(classCampaignId);
    return new SuccessResponseDto(
      `${result.count} Campaign-Student associations deleted successfully for class campaign`,
      result,
    );
  }

  @Delete('student/:studentId')
  @ApiOperation({
    summary: 'Delete all campaign-student associations for a student',
  })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description:
      'All campaign-student associations for the student have been deleted',
    type: SuccessResponseDto,
  })
  async removeByStudent(@Param('studentId') studentId: string) {
    const result = await this.campaignStudentService.removeByStudent(studentId);
    return new SuccessResponseDto(
      `${result.count} Campaign-Student associations deleted successfully for student`,
      result,
    );
  }
}
