import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from '../entities/provider.entity';
import { CreateProviderDto, UpdateProviderDto, ProviderQueryDto } from '../dto/provider.dto';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(Provider)
    private providerRepository: Repository<Provider>,
  ) {}

  async create(createProviderDto: CreateProviderDto): Promise<Provider> {
    const provider = this.providerRepository.create(createProviderDto);
    return this.providerRepository.save(provider);
  }

  async findAll(query: ProviderQueryDto): Promise<{ data: Provider[]; total: number; page: number; limit: number }> {
    const pageNum = query.page ? parseInt(query.page as string) : 1;
    const limitNum = query.limit ? parseInt(query.limit as string) : 10;
    const skip = (pageNum - 1) * limitNum;

    const queryBuilder = this.providerRepository.createQueryBuilder('provider');

    if (query.search) {
      queryBuilder.where(
        '(provider.firstName ILIKE :search OR provider.lastName ILIKE :search OR provider.specialization ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query.providerType) {
      queryBuilder.andWhere('provider.providerType = :providerType', { providerType: query.providerType });
    }

    if (query.specialization) {
      queryBuilder.andWhere('provider.specialization ILIKE :specialization', { specialization: `%${query.specialization}%` });
    }

    if (query.city) {
      queryBuilder.andWhere('provider.city ILIKE :city', { city: `%${query.city}%` });
    }

    if (query.state) {
      queryBuilder.andWhere('provider.state ILIKE :state', { state: `%${query.state}%` });
    }

    if (query.hospitalId) {
      queryBuilder.andWhere('provider.hospitalId = :hospitalId', { hospitalId: query.hospitalId });
    }

    if (query.isActive !== undefined) {
      queryBuilder.andWhere('provider.isActive = :isActive', { isActive: query.isActive });
    }

    if (query.verificationStatus) {
      queryBuilder.andWhere('provider.verificationStatus = :verificationStatus', { verificationStatus: query.verificationStatus });
    }

    if (query.acceptingNewPatients !== undefined) {
      queryBuilder.andWhere('provider.acceptingNewPatients = :acceptingNewPatients', { acceptingNewPatients: query.acceptingNewPatients });
    }

    const total = await queryBuilder.getCount();
    const data = await queryBuilder.skip(skip).take(limitNum).getMany();

    return { data, total, page: pageNum, limit: limitNum };
  }

  async findOne(id: string): Promise<Provider> {
    const provider = await this.providerRepository.findOne({ where: { id } });
    if (!provider) {
      throw new NotFoundException(`Provider with ID ${id} not found`);
    }
    return provider;
  }

  async findByUserId(userId: string): Promise<Provider | null> {
    return this.providerRepository.findOne({ where: { userId } });
  }

  async findBySpecialization(specialization: string): Promise<Provider[]> {
    return this.providerRepository.find({
      where: { specialization, isActive: true },
      order: { rating: 'DESC' },
    });
  }

  async findNearby(latitude: number, longitude: number, radiusKm: number): Promise<Provider[]> {
    const latRange = radiusKm / 111;
    const lonRange = radiusKm / (111 * Math.cos(latitude * Math.PI / 180));

    return this.providerRepository
      .createQueryBuilder('provider')
      .where('provider.isActive = :isActive', { isActive: true })
      .andWhere('provider.latitude BETWEEN :minLat AND :maxLat', {
        minLat: latitude - latRange,
        maxLat: latitude + latRange,
      })
      .andWhere('provider.longitude BETWEEN :minLon AND :maxLon', {
        minLon: longitude - lonRange,
        maxLon: longitude + lonRange,
      })
      .orderBy('provider.rating', 'DESC')
      .getMany();
  }

  async update(id: string, updateProviderDto: UpdateProviderDto): Promise<Provider> {
    const provider = await this.findOne(id);
    Object.assign(provider, updateProviderDto);
    return this.providerRepository.save(provider);
  }

  async remove(id: string): Promise<void> {
    const provider = await this.findOne(id);
    await this.providerRepository.remove(provider);
  }

  async verify(id: string): Promise<Provider> {
    const provider = await this.findOne(id);
    provider.verificationStatus = 'verified' as any;
    return this.providerRepository.save(provider);
  }

  async updateRating(id: string, newRating: number): Promise<Provider> {
    const provider = await this.findOne(id);
    const currentRating = provider.rating || 0;
    const currentCount = provider.reviewCount || 0;
    
    provider.rating = ((currentRating * currentCount) + newRating) / (currentCount + 1);
    provider.reviewCount = currentCount + 1;
    
    return this.providerRepository.save(provider);
  }

  async updateAvailability(
    id: string,
    availableDays: string[],
    availableFrom: string,
    availableTo: string,
  ): Promise<Provider> {
    const provider = await this.findOne(id);
    provider.availableDays = availableDays;
    provider.availableFrom = availableFrom;
    provider.availableTo = availableTo;
    return this.providerRepository.save(provider);
  }
}
