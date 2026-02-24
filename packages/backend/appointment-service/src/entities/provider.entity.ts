import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ProviderType {
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  SPECIALIST = 'specialist',
  SURGEON = 'surgeon',
  THERAPIST = 'therapist',
}

@Entity('providers')
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({
    type: 'enum',
    enum: ProviderType,
    default: ProviderType.DOCTOR,
  })
  providerType: ProviderType;

  @Column()
  specialization: string;

  @Column()
  licenseNumber: string;

  @Column({ nullable: true })
  licenseExpiry: Date;

  @Column()
  hospitalId: string;

  @Column()
  departmentId: string;

  @Column('simple-array', { nullable: true })
  qualifications: string[];

  @Column('simple-array', { nullable: true })
  languages: string[];

  @Column({ nullable: true })
  experience: number; // years

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ default: true })
  isAcceptingPatients: boolean;

  @Column({ default: true })
  isTelemedicineEnabled: boolean;

  @Column({ default: 30 })
  consultationDuration: number; // minutes

  @Column({ default: 0 })
  rating: number;

  @Column({ default: 0 })
  totalConsultations: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
