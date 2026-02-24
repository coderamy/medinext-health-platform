import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment, AppointmentStatus, AppointmentType } from '../entities/appointment.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    const conflict = await this.checkConflict(
      data.providerId,
      data.scheduledStart,
      data.scheduledEnd
    );

    if (conflict) {
      throw new BadRequestException('Time slot is already booked');
    }

    const appointment = this.appointmentRepository.create({
      ...data,
      status: AppointmentStatus.SCHEDULED,
    });

    return this.appointmentRepository.save(appointment);
  }

  async getAppointmentById(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({ where: { id } });
    
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    
    return appointment;
  }

  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { patientId },
      order: { scheduledStart: 'DESC' },
    });
  }

  async getAppointmentsByProvider(providerId: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { providerId },
      order: { scheduledStart: 'ASC' },
    });
  }

  async getUpcomingAppointments(patientId?: string): Promise<Appointment[]> {
    const now = new Date();
    const query = this.appointmentRepository.createQueryBuilder('appointment')
      .where('appointment.scheduledStart >= :now', { now })
      .andWhere('appointment.status IN (:...statuses)', {
        statuses: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED]
      })
      .orderBy('appointment.scheduledStart', 'ASC');

    if (patientId) {
      query.andWhere('appointment.patientId = :patientId', { patientId });
    }
    
    return query.getMany();
  }

  async checkIn(id: string): Promise<Appointment> {
    const appointment = await this.getAppointmentById(id);
    
    if (appointment.status !== AppointmentStatus.CONFIRMED && 
        appointment.status !== AppointmentStatus.SCHEDULED) {
      throw new BadRequestException('Cannot check in - appointment not confirmed or scheduled');
    }
    
    appointment.status = AppointmentStatus.CHECKED_IN;
    appointment.checkedInAt = new Date();
    
    return this.appointmentRepository.save(appointment);
  }

  async completeAppointment(id: string, notes?: string): Promise<Appointment> {
    const appointment = await this.getAppointmentById(id);
    
    appointment.status = AppointmentStatus.COMPLETED;
    appointment.actualStart = new Date();
    appointment.actualEnd = new Date();
    if (notes) {
      appointment.notes = notes;
    }
    
    return this.appointmentRepository.save(appointment);
  }

  async cancelAppointment(id: string, cancellationReason: string, cancelledBy: string): Promise<Appointment> {
    const appointment = await this.getAppointmentById(id);

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Already cancelled');
    }

    appointment.status = AppointmentStatus.CANCELLED;
    appointment.cancelledAt = new Date();
    appointment.cancellationReason = cancellationReason;
    appointment.cancelledBy = cancelledBy;

    return this.appointmentRepository.save(appointment);
  }

  async rescheduleAppointment(
    id: string, 
    newScheduleStart: Date, 
    newScheduleEnd: Date
  ): Promise<Appointment> {
    const appointment = await this.getAppointmentById(id);

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Cannot reschedule a cancelled appointment');
    }

    const conflict = await this.checkConflict(
      appointment.providerId,
      newScheduleStart,
      newScheduleEnd
    );

    if (conflict) {
      throw new BadRequestException('New time slot already booked');
    }

    appointment.rescheduledFrom = appointment.id;
    appointment.scheduledStart = newScheduleStart;
    appointment.scheduledEnd = newScheduleEnd;

    return this.appointmentRepository.save(appointment);
  }

  private async checkConflict(
    providerId: string,
    startTime: Date,
    endTime: Date
  ): Promise<boolean> {
    const existing = await this.appointmentRepository.findOne({
      where: {
        providerId,
        status: AppointmentStatus.SCHEDULED,
      },
    });

    if (!existing) return false;

    const existingStart = new Date(existing.scheduledStart).getTime();
    const existingEnd = new Date(existing.scheduledEnd).getTime();
    const newStart = startTime.getTime();
    const newEnd = endTime.getTime();

    return (newStart < existingEnd && newEnd > existingStart);
  }

  async getAppointmentsByDateRange(
    providerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: {
        providerId,
        scheduledStart: Between(startDate, endDate),
      },
      order: { scheduledStart: 'ASC' },
    });
  }

  async getProviderStats(providerId: string) {
    const completedCount = await this.appointmentRepository.count({
      where: { providerId, status: AppointmentStatus.COMPLETED }
    });

    const cancelledCount = await this.appointmentRepository.count({
      where: { providerId, status: AppointmentStatus.CANCELLED }
    });

    const upcomingCount = await this.appointmentRepository.count({
      where: { providerId, status: AppointmentStatus.SCHEDULED }
    });

    return {
      total: completedCount + cancelledCount + upcomingCount,
      completed: completedCount,
      cancelled: cancelledCount,
      upcoming: upcomingCount,
    };
  }
}
