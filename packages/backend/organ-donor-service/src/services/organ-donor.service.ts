import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganDonor, DonorStatus, RegistrationLevel } from '../entities/organ-donor.entity';
import { Recipient, RecipientStatus, UrgencyStatus } from '../entities/recipient.entity';
import { Transplant, TransplantStatus } from '../entities/transplant.entity';

@Injectable()
export class OrganDonorService {
  constructor(
    @InjectRepository(OrganDonor)
    private donorRepository: Repository<OrganDonor>,
    @InjectRepository(Recipient)
    private recipientRepository: Repository<Recipient>,
    @InjectRepository(Transplant)
    private transplantRepository: Repository<Transplant>,
  ) {}

  // Donor Management
  async registerDonor(data: Partial<OrganDonor>): Promise<OrganDonor> {
    const donor = this.donorRepository.create({
      ...data,
      status: DonorStatus.INTENT,
      registrationLevel: RegistrationLevel.LEVEL_1,
      registeredAt: new Date(),
    });
    return this.donorRepository.save(donor);
  }

  async updateDonorConsent(donorId: string, consentData: {
    hasLegalConsent: boolean;
    organsRegistered: string[];
    familyConsentRequired: boolean;
  }): Promise<OrganDonor> {
    const donor = await this.donorRepository.findOne({ where: { id: donorId } });
    if (!donor) {
      throw new NotFoundException('Donor not found');
    }

    donor.registrationLevel = RegistrationLevel.LEVEL_2;
    donor.status = DonorStatus.REGISTERED;
    donor.consentDate = new Date();
    donor.organsRegistered = consentData.organsRegistered;
    donor.familyConsentRequired = consentData.familyConsentRequired;

    return this.donorRepository.save(donor);
  }

  async getDonorById(id: string): Promise<OrganDonor> {
    const donor = await this.donorRepository.findOne({ 
      where: { id },
      relations: ['donations'],
    });
    if (!donor) {
      throw new NotFoundException('Donor not found');
    }
    return donor;
  }

  async getActiveDonors(): Promise<OrganDonor[]> {
    return this.donorRepository.find({
      where: { status: DonorStatus.ACTIVE },
    });
  }

  async revokeDonor(id: string, reason: string): Promise<OrganDonor> {
    const donor = await this.getDonorById(id);
    donor.status = DonorStatus.REVOKED;
    donor.revokedAt = new Date();
    donor.revokedReason = reason;
    return this.donorRepository.save(donor);
  }

  // Recipient Management
  async addRecipient(data: Partial<Recipient>): Promise<Recipient> {
    const recipient = this.recipientRepository.create({
      patientId: data.patientId,
      hospitalId: data.hospitalId,
      organNeeded: data.organNeeded,
      urgencyStatus: data.urgencyStatus,
      bloodType: data.bloodType,
      hlaTyping: data.hlaTyping,
      praLevel: data.praLevel || 0,
      diagnosis: data.diagnosis,
      height: data.height,
      weight: data.weight,
      medicalNotes: data.medicalNotes,
      specialRequirements: data.specialRequirements,
      status: RecipientStatus.WAITING,
      firstListingDate: new Date(),
      waitingTimeMonths: 0,
      isActive: true,
    });
    return this.recipientRepository.save(recipient);
  }

  async getRecipientById(id: string): Promise<Recipient> {
    const recipient = await this.recipientRepository.findOne({ where: { id } });
    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }
    return recipient;
  }

  async getWaitingList(organ?: string): Promise<Recipient[]> {
    const query = this.recipientRepository.createQueryBuilder('recipient')
      .where('recipient.status = :status', { status: RecipientStatus.WAITING })
      .andWhere('recipient.isActive = :isActive', { isActive: true });

    if (organ) {
      query.andWhere('recipient.organNeeded = :organ', { organ });
    }

    return query.orderBy('recipient.urgencyStatus', 'ASC')
      .addOrderBy('recipient.waitingTimeMonths', 'DESC')
      .getMany();
  }

  async updateRecipientStatus(id: string, status: RecipientStatus): Promise<Recipient> {
    const recipient = await this.getRecipientById(id);
    recipient.status = status;
    if (status === RecipientStatus.TRANSPLANTED) {
      recipient.transplantedAt = new Date();
    }
    return this.recipientRepository.save(recipient);
  }

  // Matching Algorithm
  async findMatches(donorId: string): Promise<Recipient[]> {
    const donor = await this.getDonorById(donorId);
    
    if (!donor.organsRegistered || donor.organsRegistered.length === 0) {
      throw new BadRequestException('Donor has no organs registered for donation');
    }

    const matches: Recipient[] = [];
    
    for (const organ of donor.organsRegistered) {
      const recipients = await this.recipientRepository.find({
        where: {
          organNeeded: organ,
          status: RecipientStatus.WAITING,
          isActive: true,
        },
      });

      // Filter by blood type compatibility
      const compatible = recipients.filter(r => this.isBloodTypeCompatible(donor.bloodType, r.bloodType));
      
      // Sort by urgency and waiting time
      compatible.sort((a, b) => {
        const urgencyOrder = { '1A': 0, '1B': 1, '2': 2, '3': 3, '4': 4 };
        const urgencyDiff = urgencyOrder[a.urgencyStatus] - urgencyOrder[b.urgencyStatus];
        if (urgencyDiff !== 0) return urgencyDiff;
        return b.waitingTimeMonths - a.waitingTimeMonths;
      });

      matches.push(...compatible);
    }

    return matches;
  }

  private isBloodTypeCompatible(donorType: string, recipientType: string): boolean {
    const compatibility: Record<string, string[]> = {
      'O': ['O', 'A', 'B', 'AB'],
      'A': ['A', 'AB'],
      'B': ['B', 'AB'],
      'AB': ['AB'],
    };
    return compatibility[donorType]?.includes(recipientType) || false;
  }

  // Transplant Management
  async proposeTransplant(donorId: string, recipientId: string, organ: string): Promise<Transplant> {
    const donor = await this.getDonorById(donorId);
    const recipient = await this.getRecipientById(recipientId);

    if (!donor.organsRegistered?.includes(organ)) {
      throw new BadRequestException(`Donor has not registered ${organ} for donation`);
    }

    const transplant = this.transplantRepository.create({
      donorId,
      recipientId,
      organ,
      status: TransplantStatus.PROPOSED,
      proposedAt: new Date(),
    });

    return this.transplantRepository.save(transplant);
  }

  async approveTransplant(transplantId: string): Promise<Transplant> {
    const transplant = await this.transplantRepository.findOne({ 
      where: { id: transplantId },
      relations: ['donor', 'recipient'],
    });

    if (!transplant) {
      throw new NotFoundException('Transplant not found');
    }

    transplant.status = TransplantStatus.APPROVED;
    transplant.approvedAt = new Date();

    // Update donor and recipient status
    await this.donorRepository.update(transplant.donorId, { status: DonorStatus.DECEASED });
    await this.recipientRepository.update(transplant.recipientId, { 
      status: RecipientStatus.TRANSPLANTED,
      donorId: transplant.donorId,
      transplantedAt: new Date(),
    });

    return this.transplantRepository.save(transplant);
  }

  async completeTransplant(transplantId: string, outcome: string, success: boolean): Promise<Transplant> {
    const transplant = await this.transplantRepository.findOne({ where: { id: transplantId } });
    
    if (!transplant) {
      throw new NotFoundException('Transplant not found');
    }

    transplant.status = success ? TransplantStatus.COMPLETED : TransplantStatus.FAILED;
    transplant.surgeryEndTime = new Date();
    transplant.outcome = outcome;
    transplant.isSuccessful = success;

    return this.transplantRepository.save(transplant);
  }

  async getTransplantById(id: string): Promise<Transplant> {
    const transplant = await this.transplantRepository.findOne({
      where: { id },
      relations: ['donor', 'recipient'],
    });
    if (!transplant) {
      throw new NotFoundException('Transplant not found');
    }
    return transplant;
  }

  // Statistics
  async getStatistics() {
    const totalDonors = await this.donorRepository.count();
    const activeDonors = await this.donorRepository.count({ 
      where: { status: DonorStatus.ACTIVE } 
    });
    
    const waitingRecipients = await this.recipientRepository.count({
      where: { status: RecipientStatus.WAITING },
    });

    const completedTransplants = await this.transplantRepository.count({
      where: { status: TransplantStatus.COMPLETED },
    });

    return {
      totalDonors,
      activeDonors,
      waitingRecipients,
      completedTransplants,
    };
  }
}
