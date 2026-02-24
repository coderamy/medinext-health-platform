import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { AppointmentService } from '../services/appointment.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from '../dto/appointment.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  async createAppointment(@Body() createDto: CreateAppointmentDto) {
    return this.appointmentService.createAppointment(createDto);
  }

  @Get(':id')
  async getAppointment(@Param('id') id: string) {
    return this.appointmentService.getAppointmentById(id);
  }

  @Get('patient/:patientId')
  async getPatientAppointments(@Param('patientId') patientId: string) {
    return this.appointmentService.getAppointmentsByPatient(patientId);
  }

  @Get('provider/:providerId')
  async getProviderAppointments(@Param('providerId') providerId: string) {
    return this.appointmentService.getAppointmentsByProvider(providerId);
  }

  @Get('upcoming/list')
  async getUpcomingAppointments(@Query('patientId') patientId?: string) {
    return this.appointmentService.getUpcomingAppointments(patientId);
  }

  @Put(':id/checkin')
  async checkIn(@Param('id') id: string) {
    return this.appointmentService.checkIn(id);
  }

  @Put(':id/complete')
  async complete(@Param('id') id: string, @Body('notes') notes?: string) {
    return this.appointmentService.completeAppointment(id, notes);
  }

  @Put(':id/cancel')
  async cancel(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Body('cancelledBy') cancelledBy: string,
  ) {
    return this.appointmentService.cancelAppointment(id, reason, cancelledBy);
  }

  @Put(':id/reschedule')
  async reschedule(
    @Param('id') id: string,
    @Body('newStart') newStart: Date,
    @Body('newEnd') newEnd: Date,
  ) {
    return this.appointmentService.rescheduleAppointment(id, newStart, newEnd);
  }

  @Get('provider/:providerId/stats')
  async getProviderStats(@Param('providerId') providerId: string) {
    return this.appointmentService.getProviderStats(providerId);
  }
}
