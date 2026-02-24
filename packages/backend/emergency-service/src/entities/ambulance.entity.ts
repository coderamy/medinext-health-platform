import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AmbulanceType {
  BLS = 'BLS', // Basic Life Support
  ALS = 'ALS', // Advanced Life Support
  PATIENT_TRANSPORT = 'patient_transport',
  NEONATAL = 'neonatal',
  BARIATRIC = 'bariatric',
  MOBILE_ICU = 'mobile_icu',
}

export enum AmbulanceStatus {
  AVAILABLE = 'available',
  DISPATCHED = 'dispatched',
  EN_ROUTE = 'en_route',
  AT_SCENE = 'at_scene',
  TRANSPORTING = 'transporting',
  AT_HOSPITAL = 'at_hospital',
  RETURNING = 'returning',
  OUT_OF_SERVICE = 'out_of_service',
  MAINTENANCE = 'maintenance',
}

@Entity('ambulances')
export class Ambulance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vehicleNumber: string;

  @Column()
  vehicleType: string;

  @Column({
    type: 'enum',
    enum: AmbulanceType,
    default: AmbulanceType.BLS,
  })
  ambulanceType: AmbulanceType;

  @Column({
    type: 'enum',
    enum: AmbulanceStatus,
    default: AmbulanceStatus.AVAILABLE,
  })
  status: AmbulanceStatus;

  @Column()
  baseLocation: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column({ nullable: true })
  currentLocation: string;

  @Column({ nullable: true })
  currentLatitude: number;

  @Column({ nullable: true })
  currentLongitude: number;

  @Column()
  driverName: string;

  @Column()
  driverPhone: string;

  @Column({ nullable: true })
  driverLicense: string;

  @Column('simple-array', { nullable: true })
  equipment: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastMaintenanceDate: Date;

  @Column({ nullable: true })
  nextMaintenanceDate: Date;

  @Column({ nullable: true })
  insuranceExpiry: Date;

  @Column({ nullable: true })
  currentRequestId: string;

  @Column({ default: 0 })
  totalDispatchCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
