import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ProviderService } from '../services/provider.service';
import { CreateProviderDto, UpdateProviderDto, ProviderQueryDto } from '../dto/provider.dto';
import { Provider } from '../entities/provider.entity';

@Controller('providers')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Post()
  async create(@Body() createProviderDto: CreateProviderDto): Promise<Provider> {
    return this.providerService.create(createProviderDto);
  }

  @Get()
  async findAll(@Query() query: ProviderQueryDto): Promise<{ data: Provider[]; total: number; page: number; limit: number }> {
    return this.providerService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Provider> {
    return this.providerService.findOne(id);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<Provider | null> {
    return this.providerService.findByUserId(userId);
  }

  @Get('specialization/:specialization')
  async findBySpecialization(@Param('specialization') specialization: string): Promise<Provider[]> {
    return this.providerService.findBySpecialization(specialization);
  }

  @Get('nearby/:latitude/:longitude')
  async findNearby(
    @Param('latitude') latitude: string,
    @Param('longitude') longitude: string,
    @Query('radius') radius: string,
  ): Promise<Provider[]> {
    return this.providerService.findNearby(
      parseFloat(latitude),
      parseFloat(longitude),
      radius ? parseFloat(radius) : 10,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProviderDto: UpdateProviderDto,
  ): Promise<Provider> {
    return this.providerService.update(id, updateProviderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.providerService.remove(id);
  }

  @Put(':id/verify')
  async verify(@Param('id') id: string): Promise<Provider> {
    return this.providerService.verify(id);
  }

  @Put(':id/rating')
  async updateRating(
    @Param('id') id: string,
    @Body() body: { rating: number },
  ): Promise<Provider> {
    return this.providerService.updateRating(id, body.rating);
  }

  @Put(':id/availability')
  async updateAvailability(
    @Param('id') id: string,
    @Body() body: { availableDays: string[]; availableFrom: string; availableTo: string },
  ): Promise<Provider> {
    return this.providerService.updateAvailability(
      id,
      body.availableDays,
      body.availableFrom,
      body.availableTo,
    );
  }
}
