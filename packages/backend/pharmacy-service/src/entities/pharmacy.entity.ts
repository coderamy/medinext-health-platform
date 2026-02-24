import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PharmacyType {
  CHAIN = 'chain',
  INDEPENDENT = 'independent',
  HOSPITAL = 'hospital',
  ONLINE = 'online',
}

export enum PharmacyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

@Entity('pharmacies')
export class Pharmacy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  licenseNumber: string;

  @Column({ nullable: true })
  licenseExpiry: Date;

  @Column({
    type: 'enum',
    enum: PharmacyType,
    default: PharmacyType.INDEPENDENT,
  })
  type: PharmacyType;

  @Column({
    type: 'enum',
    enum: PharmacyStatus,
    default: PharmacyStatus.ACTIVE,
  })
  status: PharmacyStatus;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  pincode: string;

  @Column({ nullable: true })
  latitude: number;

  @Column({ nullable: true })
  longitude: number;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  website: string;

  @Column({ default: true })
  is24Hours: boolean;

  @Column({ default: false })
  hasDelivery: boolean;

  @Column({ default: false })
  hasHomeDelivery: boolean;

  @Column({ default: false })
  hasOnlineConsultation: boolean;

  @Column({ default: true })
  isCompoundingAvailable: boolean;

  @Column({ default: false })
  isControlledDrugsAllowed: boolean;

  @Column('simple-array', { nullable: true })
  operatingHours: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  managerName: string;

  @Column({ nullable: true })
  managerLicense: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ default: 0 })
  totalOrders: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
