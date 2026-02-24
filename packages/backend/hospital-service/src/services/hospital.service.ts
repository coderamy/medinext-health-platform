import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hospital } from '../entities/hospital.entity';
import { CreateHospitalDto, UpdateHospitalDto, HospitalSearchDto } from '../dto/hospital.dto';

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(Hospital)
    private hospitalRepository: Repository<Hospital>,
  ) {}

  async create(createHospitalDto: CreateHospitalDto): Promise<Hospital> {
    const hospital = this.hospitalRepository.create(createHospitalDto);
    return this.hospitalRepository.save(hospital);
  }

  async findAll(searchDto?: HospitalSearchDto): Promise<Hospital[]> {
    const query = this.hospitalRepository.createQueryBuilder('hospital');

    if (searchDto?.city) {
      query.andWhere('hospital.city = :city', { city: searchDto.city });
    }

    if (searchDto?.state) {
      query.andWhere('hospital.state = :state', { state: searchDto.state });
    }

    if (searchDto?.specialty) {
      query.andWhere('hospital.departments LIKE :specialty', { specialty: `%${searchDto.specialty}%` });
    }

    if (searchDto?.hasEmergency !== undefined) {
      query.andWhere('hospital.emergencyBeds > :minEmergency', { minEmergency: 0 });
    }

    if (searchDto?.type) {
      query.andWhere('hospital.type = :type', { type: searchDto.type });
    }

    if (searchDto?.status) {
      query.andWhere('hospital.status = :status', { status: searchDto.status });
    }

    if (searchDto?.isActive !== undefined) {
      query.andWhere('hospital.isActive = :isActive', { isActive: searchDto.isActive });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Hospital> {
    const hospital = await this.hospitalRepository.findOne({ where: { id } });
    if (!hospital) {
      throw new NotFoundException(`Hospital with ID ${id} not found`);
    }
    return hospital;
  }

  async findNearby(lat: number, lng: number, radiusKm: number = 50): Promise<Hospital[]> {
    // Simple distance calculation using Haversine formula approximation
    const query = this.hospitalRepository.createQueryBuilder('hospital')
      .where('hospital.isActive = :isActive', { isActive: true })
      .andWhere(
        `(
          6371 * acos(
            cos(radians(:lat)) * cos(radians(hospital.latitude)) * 
            cos(radians(hospital.longitude) - radians(:lng)) + 
            sin(radians(:lat)) * sin(radians(hospital.latitude))
          )
        ) <= :radius`,
        { lat, lng, radius: radiusKm }
      )
      .orderBy('hospital.name', 'ASC');

    return query.getMany();
  }

  async update(id: string, updateHospitalDto: UpdateHospitalDto): Promise<Hospital> {
    const hospital = await this.findOne(id);
    Object.assign(hospital, updateHospitalDto);
    return this.hospitalRepository.save(hospital);
  }

  async remove(id: string): Promise<void> {
    const hospital = await this.findOne(id);
    await this.hospitalRepository.remove(hospital);
  }

  async getStatistics(): Promise<any> {
    const total = await this.hospitalRepository.count();
    const withEmergency = await this.hospitalRepository.count({ where: { emergencyBeds: 0 } });
    const active = await this.hospitalRepository.count({ where: { isActive: true } });

    return {
      totalHospitals: total,
      hospitalsWithEmergency: total - withEmergency,
      activeHospitals: active,
    };
  }
}
