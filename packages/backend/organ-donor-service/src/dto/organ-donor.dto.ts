import { IsString, IsEnum, IsArray, IsBoolean, IsOptional, IsDateString, IsNumber, Min, Max } from 'class-validator';
import { UrgencyStatus } from '../entities/recipient.entity';

export class CreateDonorDto {
  @IsString()
  patientId: string;

  @IsOptional()
  @IsString()
  bloodType?: string;

  @IsOptional()
  @IsString()
  hlaTyping?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  organsRegistered?: string[];

  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @IsOptional()
  @IsString()
  medicalConditions?: string;

  @IsOptional()
  @IsString()
  currentMedications?: string;
}

export class UpdateConsentDto {
  @IsBoolean()
  hasLegalConsent: boolean;

  @IsArray()
  @IsString({ each: true })
  organsRegistered: string[];

  @IsBoolean()
  familyConsentRequired: boolean;
}

export class CreateRecipientDto {
  @IsString()
  patientId: string;

  @IsString()
  hospitalId: string;

  @IsString()
  organNeeded: string;

  @IsOptional()
  @IsEnum(UrgencyStatus)
  urgencyStatus?: UrgencyStatus;

  @IsString()
  bloodType: string;

  @IsOptional()
  @IsString()
  hlaTyping?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  praLevel?: number;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsString()
  medicalNotes?: string;

  @IsOptional()
  @IsString()
  specialRequirements?: string;
}

export class ProposeTransplantDto {
  @IsString()
  donorId: string;

  @IsString()
  recipientId: string;

  @IsString()
  organ: string;
}

export class UpdateTransplantDto {
  @IsOptional()
  @IsString()
  hospitalId?: string;

  @IsOptional()
  @IsString()
  surgicalTeam?: string;

  @IsOptional()
  @IsString()
  organCondition?: string;

  @IsOptional()
  @IsNumber()
  coldIschemiaTime?: number;

  @IsOptional()
  @IsNumber()
  warmIschemiaTime?: number;
}
