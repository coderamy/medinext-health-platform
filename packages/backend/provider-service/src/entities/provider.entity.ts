import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

export enum ProviderType {
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  SPECIALIST = 'specialist',
  CONSULTANT = 'consultant',
  SURGEON = 'surgeon',
  THERAPIST = 'therapist',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

@Entity('providers')
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: ProviderType, default: ProviderType.DOCTOR })
  providerType: ProviderType;

  @Column({ nullable: true })
  specialization: string;

  @Column({ nullable: true })
  qualification: string;

  @Column({ nullable: true })
  licenseNumber: string;

  @Column({ nullable: true })
  licenseExpiryDate: Date;

  @Column({ nullable: true })
  npi: string; // National Provider Identifier

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ nullable: true })
  profileImageUrl: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  experience: number; // Years of experience

  @Column({ nullable: true })
  hospitalId: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  clinicAddress: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'enum', enum: VerificationStatus, default: VerificationStatus.PENDING })
  verificationStatus: VerificationStatus;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  consultationFee: number;

  @Column('simple-array', { nullable: true })
  languages: string[];

  @Column('simple-array', { nullable: true })
  availableDays: string[]; // ['Monday', 'Tuesday', etc.]

  @Column({ nullable: true })
  availableFrom: string; // Time e.g., "09:00"

  @Column({ nullable: true })
  availableTo: string; // Time e.g., "17:00"

  @Column({ default: false })
  acceptingNewPatients: boolean;

  @Column({ nullable: true })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
