import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

export enum EmergencyType {
  MEDICAL = 'medical',
  TRAUMA = 'trauma',
  CARDIAC = 'cardiac',
  STROKE = 'stroke',
  RESPIRATORY = 'respiratory',
  OBSTETRIC = 'obstetric',
  PEDIATRIC = 'pediatric',
  PSYCHIATRIC = 'psychiatric',
  BURNS = 'burns',
  OTHER = 'other',
}

export enum EmergencyStatus {
  PENDING = 'pending',
  DISPATCHED = 'dispatched',
  EN_ROUTE = 'en_route',
  ARRIVED = 'arrived',
  AT_HOSPITAL = 'at_hospital',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TriageCategory {
  RED = 'red',       // Life-threatening - immediate
  ORANGE = 'orange', // Emergent - within 15 min
  YELLOW = 'yellow', // Urgent - within 30 min
  GREEN = 'green',   // Minor - within 60 min
  BLACK = 'black',   // Deceased
}

@Entity('emergency_requests')
export class EmergencyRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  callerId: string;

  @Column()
  callerName: string;

  @Column()
  callerPhone: string;

  @Column({ nullable: true })
  patientId: string;

  @Column({ nullable: true })
  patientName: string;

  @Column()
  location: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column({ nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: EmergencyType,
    default: EmergencyType.MEDICAL,
  })
  emergencyType: EmergencyType;

  @Column({
    type: 'enum',
    enum: EmergencyStatus,
    default: EmergencyStatus.PENDING,
  })
  status: EmergencyStatus;

  @Column({
    type: 'enum',
    enum: TriageCategory,
  })
  triageCategory: TriageCategory;

  @Column('simple-array', { nullable: true })
  symptoms: string[];

  @Column({ nullable: true })
  symptomDescription: string;

  @Column({ default: 0 })
  urgencyScore: number; // 0-100 AI calculated

  @Column({ nullable: true })
  assignedAmbulanceId: string;

  @Column({ nullable: true })
  assignedHospitalId: string;

  @Column({ nullable: true })
  dispatchedAt: Date;

  @Column({ nullable: true })
  arrivedAt: Date;

  @Column({ nullable: true })
  pickedUpAt: Date;

  @Column({ nullable: true })
  hospitalArrivalAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ nullable: true })
  estimatedArrivalTime: number; // minutes

  @Column({ nullable: true })
  actualResponseTime: number; // minutes

  @Column({ nullable: true })
  notes: string;

  @Column({ default: false })
  isDisaster: boolean;

  @Column({ nullable: true })
  disasterEventId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
