import { ProviderType, Gender, VerificationStatus } from '../entities/provider.entity';

export interface CreateProviderDto {
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  providerType?: ProviderType;
  specialization?: string;
  qualification?: string;
  licenseNumber?: string;
  licenseExpiryDate?: Date;
  npi?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  profileImageUrl?: string;
  bio?: string;
  experience?: number;
  hospitalId?: string;
  department?: string;
  clinicAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  consultationFee?: number;
  languages?: string[];
  availableDays?: string[];
  availableFrom?: string;
  availableTo?: string;
  acceptingNewPatients?: boolean;
}

export interface UpdateProviderDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  providerType?: ProviderType;
  specialization?: string;
  qualification?: string;
  licenseNumber?: string;
  licenseExpiryDate?: Date;
  npi?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  profileImageUrl?: string;
  bio?: string;
  experience?: number;
  hospitalId?: string;
  department?: string;
  clinicAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  verificationStatus?: VerificationStatus;
  isActive?: boolean;
  consultationFee?: number;
  languages?: string[];
  availableDays?: string[];
  availableFrom?: string;
  availableTo?: string;
  acceptingNewPatients?: boolean;
}

export interface ProviderQueryDto {
  search?: string;
  providerType?: string;
  specialization?: string;
  city?: string;
  state?: string;
  hospitalId?: string;
  isActive?: boolean;
  verificationStatus?: string;
  acceptingNewPatients?: boolean;
  page?: string | number;
  limit?: string | number;
}
