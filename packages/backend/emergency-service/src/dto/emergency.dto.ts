import { IsString, IsEnum, IsArray, IsOptional, IsNumber, Min, Max, IsBoolean } from 'class-validator';
import { EmergencyType, EmergencyStatus, TriageCategory } from '../entities/emergency-request.entity';

export class CreateEmergencyDto {
  @IsString()
  callerId: string;

  @IsString()
  callerName: string;

  @IsString()
  callerPhone: string;

  @IsOptional()
  @IsString()
  patientId?: string;

  @IsOptional()
  @IsString()
  patientName?: string;

  @IsString()
  location: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(EmergencyType)
  emergencyType?: EmergencyType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  symptoms?: string[];

  @IsOptional()
  @IsString()
  symptomDescription?: string;

  @IsOptional()
  @IsBoolean()
  isDisaster?: boolean;

  @IsOptional()
  @IsString()
  disasterEventId?: string;
}

export class UpdateStatusDto {
  @IsEnum(EmergencyStatus)
  status: EmergencyStatus;
}

export class DispatchAmbulanceDto {
  @IsString()
  ambulanceId: string;
}

export class AssignHospitalDto {
  @IsString()
  hospitalId: string;
}
