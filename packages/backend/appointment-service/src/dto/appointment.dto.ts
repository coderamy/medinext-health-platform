import { IsString, IsOptional, IsDateString, IsBoolean, IsNumber, IsEnum } from 'class-validator';
import { AppointmentType } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @IsString()
  patientId: string;

  @IsString()
  providerId: string;

  @IsString()
  hospitalId: string;

  @IsString()
  departmentId: string;

  @IsOptional()
  @IsEnum(AppointmentType)
  type?: AppointmentType;

  @IsDateString()
  scheduledStart: Date;

  @IsDateString()
  scheduledEnd: Date;

  @IsOptional()
  @IsString()
  reasonForVisit?: string;

  @IsOptional()
  @IsString()
  symptoms?: string;

  @IsOptional()
  @IsBoolean()
  isTelemedicine?: boolean;
}

export class UpdateAppointmentDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  scheduledStart?: Date;

  @IsOptional()
  @IsDateString()
  scheduledEnd?: Date;

  @IsOptional()
  @IsString()
  notes?: string;
}
