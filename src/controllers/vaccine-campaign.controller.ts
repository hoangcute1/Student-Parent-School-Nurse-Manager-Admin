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
import { VaccineCampaignService } from '@/services/vaccine-campaign.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CreateVaccineCampaignDto } from '@/decorations/dto/create-vaccine-campaign.dto';
import { UpdateVaccineCampaignDto } from '@/decorations/dto/update-vaccine-campaign.dto';

@ApiTags('vaccine-campaigns')
@Controller('vaccine-campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class VaccineCampaignController {
  constructor(private readonly vaccineCampaignService: VaccineCampaignService) {}

  @Get()
  @ApiOperation({ summary: 'Get all vaccine campaigns' })
  @ApiResponse({ status: 200, description: 'Return all vaccine campaigns.' })
  async findAll() {
    return this.vaccineCampaignService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vaccine campaign by ID' })
  @ApiParam({ name: 'id', description: 'Vaccine campaign ID' })
  @ApiResponse({ status: 200, description: 'Return the vaccine campaign.' })
  @ApiResponse({ status: 404, description: 'Vaccine campaign not found.' })
  async findOne(@Param('id') id: string) {
    return this.vaccineCampaignService.findById(id);
  }

  @Get('vaccine/:vaccineId')
  @ApiOperation({ summary: 'Get vaccine campaigns by vaccine ID' })
  @ApiParam({ name: 'vaccineId', description: 'Vaccine ID' })
  @ApiResponse({ status: 200, description: 'Return vaccine campaigns for a vaccine.' })
  async findByVaccineId(@Param('vaccineId') vaccineId: string) {
    return this.vaccineCampaignService.findByVaccineId(vaccineId);
  }

  @Get('staff/:staffId')
  @ApiOperation({ summary: 'Get vaccine campaigns by staff ID' })
  @ApiParam({ name: 'staffId', description: 'Staff ID' })
  @ApiResponse({ status: 200, description: 'Return vaccine campaigns for a staff member.' })
  async findByStaffId(@Param('staffId') staffId: string) {
    return this.vaccineCampaignService.findByStaffId(staffId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new vaccine campaign' })
  @ApiResponse({ status: 201, description: 'The vaccine campaign has been created.' })
  async create(@Body() createVaccineCampaignDto: CreateVaccineCampaignDto) {
    return this.vaccineCampaignService.create(createVaccineCampaignDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a vaccine campaign' })
  @ApiParam({ name: 'id', description: 'Vaccine campaign ID' })
  @ApiResponse({ status: 200, description: 'The vaccine campaign has been updated.' })
  @ApiResponse({ status: 404, description: 'Vaccine campaign not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateVaccineCampaignDto: UpdateVaccineCampaignDto,
  ) {
    return this.vaccineCampaignService.update(id, updateVaccineCampaignDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vaccine campaign' })
  @ApiParam({ name: 'id', description: 'Vaccine campaign ID' })
  @ApiResponse({ status: 200, description: 'The vaccine campaign has been deleted.' })
  @ApiResponse({ status: 404, description: 'Vaccine campaign not found.' })
  async remove(@Param('id') id: string) {
    return this.vaccineCampaignService.remove(id);
  }
}
