import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum DonorStatus {
  INTENT = 'intent',
  REGISTERED = 'registered',
  ACTIVE = 'active',
  REVOKED = 'revoked',
  DECEASED = 'deceased',
}

export enum RegistrationLevel {
  LEVEL_1 = 1, // Intent
  LEVEL_2 = 2, // Legal Consent
  LEVEL_3 = 3, // Medical Registration
}

@Entity('organ_donors')
export class OrganDonor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @Column({
    type: 'enum',
    enum: DonorStatus,
    default: DonorStatus.INTENT,
  })
  status: DonorStatus;

  @Column({
    type: 'enum',
    enum: RegistrationLevel,
    default: RegistrationLevel.LEVEL_1,
  })
  registrationLevel: RegistrationLevel;

  @Column({ nullable: true })
  bloodType: string;

  @Column({ nullable: true })
  hlaTyping: string;

  @Column('simple-array', { nullable: true })
  organsRegistered: string[];

  @Column({ default: false })
  familyConsentRequired: boolean;

  @Column({ default: false })
  familyNotified: boolean;

  @Column({ nullable: true })
  consentDate: Date;

  @Column({ nullable: true })
  legalDocumentHash: string;

  @Column({ nullable: true })
  emergencyContactName: string;

  @Column({ nullable: true })
  emergencyContactPhone: string;

  @Column({ nullable: true })
  medicalConditions: string;

  @Column({ nullable: true })
  currentMedications: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  registeredAt: Date;

  @Column({ nullable: true })
  revokedAt: Date;

  @Column({ nullable: true })
  revokedReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
