import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { EmergencyService } from '../services/emergency.service';
import { CreateEmergencyDto, UpdateStatusDto, DispatchAmbulanceDto } from '../dto/emergency.dto';

@Controller('emergency')
export class EmergencyController {
  constructor(private readonly emergencyService: EmergencyService) {}

  // Emergency Request Endpoints
  @Post('requests')
  async createRequest(@Body() createDto: CreateEmergencyDto) {
    return this.emergencyService.createEmergencyRequest(createDto);
  }

  @Get('requests/:id')
  async getRequest(@Param('id') id: string) {
    return this.emergencyService.getRequestById(id);
  }

  @Get('requests')
  async getActiveRequests() {
    return this.emergencyService.getActiveRequests();
  }

  @Get('requests/status/:status')
  async getRequestsByStatus(@Param('status') status: string) {
    return this.emergencyService.getRequestsByStatus(status as any);
  }

  @Put('requests/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateStatusDto,
  ) {
    return this.emergencyService.updateRequestStatus(id, updateDto.status);
  }

  @Put('requests/:id/dispatch')
  async dispatchAmbulance(
    @Param('id') id: string,
    @Body() dispatchDto: DispatchAmbulanceDto,
  ) {
    return this.emergencyService.dispatchAmbulance(id, dispatchDto.ambulanceId);
  }

  // Ambulance Endpoints
  @Get('ambulances')
  async getAvailableAmbulances(@Query('type') type?: string) {
    return this.emergencyService.getAvailableAmbulances(type as any);
  }

  @Get('ambulances/nearest')
  async getNearestAmbulance(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('type') type?: string,
  ) {
    return this.emergencyService.findNearestAmbulance(
      parseFloat(String(latitude)),
      parseFloat(String(longitude)),
      type as any
    );
  }

  // Statistics
  @Get('statistics')
  async getStatistics() {
    return this.emergencyService.getStatistics();
  }
}
