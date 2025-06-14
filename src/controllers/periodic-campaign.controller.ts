import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PeriodicCampaignService } from '@/services/periodic-campaign.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CreatePeriodicCampaignDto } from '@/decorations/dto/create-periodic-campaign.dto';
import { UpdatePeriodicCampaignDto } from '@/decorations/dto/update-periodic-campaign.dto';

@ApiTags('periodic-campaigns')
@Controller('periodic-campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PeriodicCampaignController {
  constructor(private readonly periodicCampaignService: PeriodicCampaignService) {}

  @Get()
  @ApiOperation({ summary: 'Get all periodic campaigns' })
  @ApiResponse({ status: 200, description: 'Return all periodic campaigns.' })
  async findAll() {
    return this.periodicCampaignService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a periodic campaign by ID' })
  @ApiParam({ name: 'id', description: 'Periodic campaign ID' })
  @ApiResponse({ status: 200, description: 'Return the periodic campaign.' })
  @ApiResponse({ status: 404, description: 'Periodic campaign not found.' })
  async findOne(@Param('id') id: string) {
    return this.periodicCampaignService.findById(id);
  }

  @Get('staff/:staffId')
  @ApiOperation({ summary: 'Get periodic campaigns by staff ID' })
  @ApiParam({ name: 'staffId', description: 'Staff ID' })
  @ApiResponse({ status: 200, description: 'Return periodic campaigns for a staff member.' })
  async findByStaffId(@Param('staffId') staffId: string) {
    return this.periodicCampaignService.findByStaffId(staffId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new periodic campaign' })
  @ApiResponse({ status: 201, description: 'The periodic campaign has been created.' })
  async create(@Body() createPeriodicCampaignDto: CreatePeriodicCampaignDto) {
    return this.periodicCampaignService.create(createPeriodicCampaignDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a periodic campaign' })
  @ApiParam({ name: 'id', description: 'Periodic campaign ID' })
  @ApiResponse({ status: 200, description: 'The periodic campaign has been updated.' })
  @ApiResponse({ status: 404, description: 'Periodic campaign not found.' })
  async update(
    @Param('id') id: string,
    @Body() updatePeriodicCampaignDto: UpdatePeriodicCampaignDto,
  ) {
    return this.periodicCampaignService.update(id, updatePeriodicCampaignDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a periodic campaign' })
  @ApiParam({ name: 'id', description: 'Periodic campaign ID' })
  @ApiResponse({ status: 200, description: 'The periodic campaign has been deleted.' })
  @ApiResponse({ status: 404, description: 'Periodic campaign not found.' })
  async remove(@Param('id') id: string) {
    return this.periodicCampaignService.remove(id);
  }
}
