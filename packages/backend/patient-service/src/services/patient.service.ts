import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { CreatePatientDto, UpdatePatientDto, PatientQueryDto } from '../dto/patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientRepository.create(createPatientDto);
    return this.patientRepository.save(patient);
  }

  async findAll(query: PatientQueryDto): Promise<{ data: Patient[]; total: number; page: number; limit: number }> {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    const queryBuilder = this.patientRepository.createQueryBuilder('patient');

    if (query.search) {
      queryBuilder.where(
        '(patient.firstName ILIKE :search OR patient.lastName ILIKE :search OR patient.phone ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query.bloodType) {
      queryBuilder.andWhere('patient.bloodType = :bloodType', { bloodType: query.bloodType });
    }

    if (query.city) {
      queryBuilder.andWhere('patient.city ILIKE :city', { city: `%${query.city}%` });
    }

    if (query.state) {
      queryBuilder.andWhere('patient.state ILIKE :state', { state: `%${query.state}%` });
    }

    if (query.isActive !== undefined) {
      queryBuilder.andWhere('patient.isActive = :isActive', { isActive: query.isActive });
    }

    const total = await queryBuilder.getCount();
    const data = await queryBuilder.skip(skip).take(limit).getMany();

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async findByUserId(userId: string): Promise<Patient | null> {
    return this.patientRepository.findOne({ where: { userId } });
  }

  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);
    Object.assign(patient, updatePatientDto);
    return this.patientRepository.save(patient);
  }

  async remove(id: string): Promise<void> {
    const patient = await this.findOne(id);
    await this.patientRepository.remove(patient);
  }

  async updateInsuranceInfo(
    id: string,
    insuranceProvider: string,
    insurancePolicyNumber: string,
  ): Promise<Patient> {
    const patient = await this.findOne(id);
    patient.insuranceProvider = insuranceProvider;
    patient.insurancePolicyNumber = insurancePolicyNumber;
    return this.patientRepository.save(patient);
  }

  async updateEmergencyContact(
    id: string,
    emergencyContactName: string,
    emergencyContactPhone: string,
    emergencyContactRelationship: string,
  ): Promise<Patient> {
    const patient = await this.findOne(id);
    patient.emergencyContactName = emergencyContactName;
    patient.emergencyContactPhone = emergencyContactPhone;
    patient.emergencyContactRelationship = emergencyContactRelationship;
    return this.patientRepository.save(patient);
  }
}
