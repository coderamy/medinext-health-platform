import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum HospitalType {
  GOVERNMENT = 'government',
  PRIVATE = 'private',
  SEMI_GOVERNMENT = 'semi_government',
  CHARITY = 'charity',
}

export enum HospitalStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  UNDER_MAINTENANCE = 'under_maintenance',
}

@Entity('hospitals')
export class Hospital {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  registrationNumber: string;

  @Column({
    type: 'enum',
    enum: HospitalType,
    default: HospitalType.PRIVATE,
  })
  type: HospitalType;

  @Column({
    type: 'enum',
    enum: HospitalStatus,
    default: HospitalStatus.ACTIVE,
  })
  status: HospitalStatus;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  emergencyPhone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'int', default: 0 })
  totalBeds: number;

  @Column({ type: 'int', default: 0 })
  availableBeds: number;

  @Column({ type: 'int', default: 0 })
  icuBeds: number;

  @Column({ type: 'int', default: 0 })
  icuAvailable: number;

  @Column({ type: 'int', default: 0 })
  emergencyBeds: number;

  @Column({ type: 'int', default: 0 })
  emergencyAvailable: number;

  @Column({ type: 'int', default: 0 })
  operationTheaters: number;

  @Column({ type: 'int', default: 0 })
  ventilators: number;

  @Column({ type: 'int', default: 0 })
  ventilatorsAvailable: number;

  @Column({ default: false })
  hasBloodBank: boolean;

  @Column({ default: false })
  hasOrganTransplant: boolean;

  @Column({ default: false })
  hasTraumaCenter: boolean;

  @Column({ default: false })
  hasCardiacCenter: boolean;

  @Column({ default: false })
  hasStrokeCenter: boolean;

  @Column({ default: false })
  hasNICU: boolean;

  @Column({ default: false })
  hasMRI: boolean;

  @Column({ default: false })
  hasCTScan: boolean;

  @Column({ default: false })
  hasDialysis: boolean;

  @Column({ nullable: true })
  certifications: string;

  @Column({ type: 'simple-array', nullable: true })
  departments: string[];

  @Column({ nullable: true })
  insuranceProviders: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  images: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
