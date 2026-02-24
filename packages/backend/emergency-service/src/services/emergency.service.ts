import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmergencyRequest, EmergencyStatus, TriageCategory } from '../entities/emergency-request.entity';
import { Ambulance, AmbulanceStatus, AmbulanceType } from '../entities/ambulance.entity';

@Injectable()
export class EmergencyService {
  constructor(
    @InjectRepository(EmergencyRequest)
    private requestRepository: Repository<EmergencyRequest>,
    @InjectRepository(Ambulance)
    private ambulanceRepository: Repository<Ambulance>,
  ) {}

  // Emergency Request Management
  async createEmergencyRequest(data: Partial<EmergencyRequest>): Promise<EmergencyRequest> {
    // AI-powered triage
    const triageCategory = await this.performTriage(data.symptoms || [], data.emergencyType);
    const urgencyScore = this.calculateUrgencyScore(data.symptoms || [], data.emergencyType);

    const request = this.requestRepository.create({
      ...data,
      triageCategory,
      urgencyScore,
      status: EmergencyStatus.PENDING,
    });

    return this.requestRepository.save(request);
  }

  async getRequestById(id: string): Promise<EmergencyRequest> {
    const request = await this.requestRepository.findOne({ where: { id } });
    if (!request) {
      throw new NotFoundException('Emergency request not found');
    }
    return request;
  }

  async getActiveRequests(): Promise<EmergencyRequest[]> {
    return this.requestRepository.find({
      where: [
        { status: EmergencyStatus.PENDING },
        { status: EmergencyStatus.DISPATCHED },
        { status: EmergencyStatus.EN_ROUTE },
        { status: EmergencyStatus.ARRIVED },
      ],
      order: { urgencyScore: 'DESC', createdAt: 'ASC' },
    });
  }

  async getRequestsByStatus(status: EmergencyStatus): Promise<EmergencyRequest[]> {
    return this.requestRepository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  // Ambulance Management
  async getAvailableAmbulances(type?: AmbulanceType): Promise<Ambulance[]> {
    const query = this.ambulanceRepository.createQueryBuilder('ambulance')
      .where('ambulance.status = :status', { status: AmbulanceStatus.AVAILABLE })
      .andWhere('ambulance.isActive = :isActive', { isActive: true });

    if (type) {
      query.andWhere('ambulance.ambulanceType = :type', { type });
    }

    return query.getMany();
  }

  async findNearestAmbulance(latitude: number, longitude: number, type?: AmbulanceType): Promise<Ambulance | null> {
    const query = this.ambulanceRepository.createQueryBuilder('ambulance')
      .where('ambulance.status = :status', { status: AmbulanceStatus.AVAILABLE })
      .andWhere('ambulance.isActive = :isActive', { isActive: true })
      .orderBy(`ST_Distance(
        ST_MakePoint(ambulance.longitude, ambulance.latitude)::geography,
        ST_MakePoint(${longitude}, ${latitude})::geography
      )`, 'ASC')
      .limit(1);

    if (type) {
      query.andWhere('ambulance.ambulanceType = :type', { type });
    }

    return query.getOne();
  }

  // Dispatch Logic
  async dispatchAmbulance(requestId: string, ambulanceId: string): Promise<EmergencyRequest> {
    const request = await this.getRequestById(requestId);
    const ambulance = await this.ambulanceRepository.findOne({ where: { id: ambulanceId } });

    if (!ambulance) {
      throw new NotFoundException('Ambulance not found');
    }

    if (ambulance.status !== AmbulanceStatus.AVAILABLE) {
      throw new BadRequestException('Ambulance is not available');
    }

    // Update ambulance status
    ambulance.status = AmbulanceStatus.DISPATCHED;
    ambulance.currentRequestId = requestId;
    await this.ambulanceRepository.save(ambulance);

    // Update request
    request.status = EmergencyStatus.DISPATCHED;
    request.assignedAmbulanceId = ambulanceId;
    request.dispatchedAt = new Date();

    // Calculate ETA (simplified - in production use actual routing)
    request.estimatedArrivalTime = this.calculateETA(
      ambulance.latitude, ambulance.longitude,
      request.latitude, request.longitude
    );

    return this.requestRepository.save(request);
  }

  async updateRequestStatus(requestId: string, status: EmergencyStatus): Promise<EmergencyRequest> {
    const request = await this.getRequestById(requestId);
    request.status = status;

    switch (status) {
      case EmergencyStatus.ARRIVED:
        request.arrivedAt = new Date();
        break;
      case EmergencyStatus.AT_HOSPITAL:
        request.hospitalArrivalAt = new Date();
        // Update ambulance status
        if (request.assignedAmbulanceId) {
          await this.ambulanceRepository.update(request.assignedAmbulanceId, {
            status: AmbulanceStatus.AT_HOSPITAL,
          });
        }
        break;
      case EmergencyStatus.COMPLETED:
        request.completedAt = new Date();
        // Calculate actual response time
        if (request.dispatchedAt) {
          request.actualResponseTime = Math.round(
            (new Date().getTime() - request.dispatchedAt.getTime()) / 60000
          );
        }
        // Free up ambulance
        if (request.assignedAmbulanceId) {
          await this.ambulanceRepository.update(request.assignedAmbulanceId, {
            status: AmbulanceStatus.AVAILABLE,
            currentRequestId: null,
          });
        }
        break;
    }

    return this.requestRepository.save(request);
  }

  // AI Triage System
  private async performTriage(symptoms: string[], emergencyType: string): Promise<TriageCategory> {
    // Critical symptoms that require immediate response
    const criticalSymptoms = [
      'chest pain', 'difficulty breathing', 'unconscious', 'not breathing',
      'severe bleeding', 'stroke', 'heart attack', 'seizure', 'severe burns'
    ];
    
    const seriousSymptoms = [
      'shortness of breath', 'severe pain', 'high fever', 'vomiting blood',
      'internal bleeding', 'broken bones', 'head injury'
    ];

    const symptomString = symptoms.join(' ').toLowerCase();

    // Check for critical symptoms
    if (criticalSymptoms.some(s => symptomString.includes(s))) {
      return TriageCategory.RED;
    }

    // Check for serious symptoms
    if (seriousSymptoms.some(s => symptomString.includes(s))) {
      return TriageCategory.ORANGE;
    }

    // Default to yellow (urgent)
    return TriageCategory.YELLOW;
  }

  private calculateUrgencyScore(symptoms: string[], emergencyType: string): number {
    let score = 50; // Base score

    const symptomWeights: Record<string, number> = {
      'chest pain': 40,
      'difficulty breathing': 40,
      'unconscious': 50,
      'severe bleeding': 45,
      'stroke': 50,
      'heart attack': 50,
      'seizure': 35,
      'severe burns': 40,
      'shortness of breath': 30,
      'severe pain': 25,
      'high fever': 15,
      'vomiting blood': 35,
    };

    for (const symptom of symptoms) {
      const weight = symptomWeights[symptom.toLowerCase()] || 5;
      score += weight;
    }

    return Math.min(100, score);
  }

  private calculateETA(
    fromLat: number, fromLng: number,
    toLat: number, toLng: number
  ): number {
    // Simplified distance calculation (Haversine)
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(toLat - fromLat);
    const dLng = this.toRad(toLng - fromLng);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(fromLat)) * Math.cos(this.toRad(toLat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Assume average speed of 40 km/h in city
    return Math.round((distance / 40) * 60); // Return minutes
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Statistics
  async getStatistics() {
    const totalRequests = await this.requestRepository.count();
    const pendingRequests = await this.requestRepository.count({
      where: { status: EmergencyStatus.PENDING },
    });
    const completedRequests = await this.requestRepository.count({
      where: { status: EmergencyStatus.COMPLETED },
    });
    const availableAmbulances = await this.ambulanceRepository.count({
      where: { status: AmbulanceStatus.AVAILABLE },
    });

    // Average response time
    const completedWithTime = await this.requestRepository
      .createQueryBuilder('request')
      .where('request.actualResponseTime IS NOT NULL')
      .getMany();
    
    const avgResponseTime = completedWithTime.length > 0
      ? completedWithTime.reduce((sum, r) => sum + (r.actualResponseTime || 0), 0) / completedWithTime.length
      : 0;

    return {
      totalRequests,
      pendingRequests,
      completedRequests,
      availableAmbulances,
      avgResponseTime: Math.round(avgResponseTime),
    };
  }
}
