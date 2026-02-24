import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { HospitalService } from '../services/hospital.service';
import { CreateHospitalDto, UpdateHospitalDto, HospitalSearchDto } from '../dto/hospital.dto';
import { Hospital } from '../entities/hospital.entity';

@ApiTags('hospitals')
@Controller('hospitals')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new hospital' })
  @ApiResponse({ status: 201, description: 'Hospital created successfully', type: Hospital })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createHospitalDto: CreateHospitalDto): Promise<Hospital> {
    return this.hospitalService.create(createHospitalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all hospitals with optional filters' })
  @ApiResponse({ status: 200, description: 'List of hospitals', type: [Hospital] })
  async findAll(@Query() searchDto: HospitalSearchDto): Promise<Hospital[]> {
    return this.hospitalService.findAll(searchDto);
  }

  @Get('nearby/:latitude/:longitude')
  @ApiOperation({ summary: 'Find hospitals near a location' })
  @ApiParam({ name: 'latitude', description: 'Latitude coordinate' })
  @ApiParam({ name: 'longitude', description: 'Longitude coordinate' })
  @ApiQuery({ name: 'radiusKm', description: 'Search radius in kilometers', required: false })
  @ApiResponse({ status: 200, description: 'List of nearby hospitals', type: [Hospital] })
  async findNearby(
    @Param('latitude') latitude: number,
    @Param('longitude') longitude: number,
    @Query('radiusKm') radiusKm?: number,
  ): Promise<Hospital[]> {
    return this.hospitalService.findNearby(latitude, longitude, radiusKm);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get hospital statistics' })
  @ApiResponse({ status: 200, description: 'Hospital statistics' })
  async getStatistics(): Promise<any> {
    return this.hospitalService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a hospital by ID' })
  @ApiParam({ name: 'id', description: 'Hospital UUID' })
  @ApiResponse({ status: 200, description: 'Hospital found', type: Hospital })
  @ApiResponse({ status: 404, description: 'Hospital not found' })
  async findOne(@Param('id') id: string): Promise<Hospital> {
    return this.hospitalService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a hospital' })
  @ApiParam({ name: 'id', description: 'Hospital UUID' })
  @ApiResponse({ status: 200, description: 'Hospital updated', type: Hospital })
  @ApiResponse({ status: 404, description: 'Hospital not found' })
  async update(
    @Param('id') id: string,
    @Body() updateHospitalDto: UpdateHospitalDto,
  ): Promise<Hospital> {
    return this.hospitalService.update(id, updateHospitalDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a hospital' })
  @ApiParam({ name: 'id', description: 'Hospital UUID' })
  @ApiResponse({ status: 204, description: 'Hospital deleted' })
  @ApiResponse({ status: 404, description: 'Hospital not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.hospitalService.remove(id);
  }
}
