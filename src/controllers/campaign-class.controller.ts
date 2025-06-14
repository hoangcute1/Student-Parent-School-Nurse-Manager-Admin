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
} from '@nestjs/common';
import { CampaignClassService } from '@/services/campaign-class.service';
import { CreateCampaignClassDto } from '@/decorations/dto/create-campaign-class.dto';
import { UpdateCampaignClassDto } from '@/decorations/dto/update-campaign-class.dto';
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

@ApiTags('campaign-class')
@Controller('campaign-class')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CampaignClassController {
  constructor(private readonly campaignClassService: CampaignClassService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new campaign-class association' })
  @ApiBody({
    type: CreateCampaignClassDto,
    description: 'Campaign-Class association data',
  })
  @ApiResponse({
    status: 201,
    description: 'The campaign-class association has been successfully created',
    type: SuccessResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Association already exists' })
  async create(@Body() createCampaignClassDto: CreateCampaignClassDto) {
    const result = await this.campaignClassService.create(
      createCampaignClassDto,
    );
    return new SuccessResponseDto(
      'Campaign-Class association created successfully',
      result,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all campaign-class associations' })
  @ApiResponse({
    status: 200,
    description: 'List of all campaign-class associations',
    type: PaginatedResponseDto,
  })
  async findAll() {
    const results = await this.campaignClassService.findAll();
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
      'Campaign-Class associations retrieved successfully',
    );
  }

  @Get('campaign/:campaignId')
  @ApiOperation({ summary: 'Get campaign-class associations by campaign ID' })
  @ApiParam({ name: 'campaignId', description: 'Campaign ID' })
  @ApiResponse({
    status: 200,
    description:
      'List of campaign-class associations for the specified campaign',
    type: PaginatedResponseDto,
  })
  async findByCampaign(@Param('campaignId') campaignId: string) {
    const results = await this.campaignClassService.findByCampaign(campaignId);
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
      'Campaign-Class associations for campaign retrieved successfully',
    );
  }

  @Get('class/:classId')
  @ApiOperation({ summary: 'Get campaign-class associations by class ID' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({
    status: 200,
    description: 'List of campaign-class associations for the specified class',
    type: PaginatedResponseDto,
  })
  async findByClass(@Param('classId') classId: string) {
    const results = await this.campaignClassService.findByClass(classId);
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
      'Campaign-Class associations for class retrieved successfully',
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a campaign-class association by ID' })
  @ApiParam({ name: 'id', description: 'Campaign-Class association ID' })
  @ApiResponse({
    status: 200,
    description: 'Campaign-Class association details',
    type: SuccessResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Association not found' })
  async findOne(@Param('id') id: string) {
    const result = await this.campaignClassService.findById(id);
    return new SuccessResponseDto(
      'Campaign-Class association retrieved successfully',
      result,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a campaign-class association' })
  @ApiParam({ name: 'id', description: 'Campaign-Class association ID' })
  @ApiBody({
    type: UpdateCampaignClassDto,
    description: 'Updated campaign-class association data',
  })
  @ApiResponse({
    status: 200,
    description: 'The campaign-class association has been successfully updated',
    type: SuccessResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Association not found' })
  async update(
    @Param('id') id: string,
    @Body() updateCampaignClassDto: UpdateCampaignClassDto,
  ) {
    const result = await this.campaignClassService.update(
      id,
      updateCampaignClassDto,
    );
    return new SuccessResponseDto(
      'Campaign-Class association updated successfully',
      result,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a campaign-class association' })
  @ApiParam({ name: 'id', description: 'Campaign-Class association ID' })
  @ApiResponse({
    status: 200,
    description: 'The campaign-class association has been successfully deleted',
    type: SuccessResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Association not found' })
  async remove(@Param('id') id: string) {
    const result = await this.campaignClassService.remove(id);
    return new SuccessResponseDto(
      'Campaign-Class association deleted successfully',
      result,
    );
  }

  @Delete('campaign/:campaignId')
  @ApiOperation({
    summary: 'Delete all campaign-class associations for a campaign',
  })
  @ApiParam({ name: 'campaignId', description: 'Campaign ID' })
  @ApiResponse({
    status: 200,
    description:
      'All campaign-class associations for the campaign have been deleted',
    type: SuccessResponseDto,
  })
  async removeByCampaign(@Param('campaignId') campaignId: string) {
    const result = await this.campaignClassService.removeByCampaign(campaignId);
    return new SuccessResponseDto(
      `${result.count} Campaign-Class associations deleted successfully for campaign`,
      result,
    );
  }

  @Delete('class/:classId')
  @ApiOperation({
    summary: 'Delete all campaign-class associations for a class',
  })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({
    status: 200,
    description:
      'All campaign-class associations for the class have been deleted',
    type: SuccessResponseDto,
  })
  async removeByClass(@Param('classId') classId: string) {
    const result = await this.campaignClassService.removeByClass(classId);
    return new SuccessResponseDto(
      `${result.count} Campaign-Class associations deleted successfully for class`,
      result,
    );
  }
}
