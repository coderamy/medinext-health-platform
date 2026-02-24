import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { OrganDonor } from './organ-donor.entity';

export enum RecipientStatus {
  WAITING = 'waiting',
  ACTIVE = 'active',
  TRANSPLANTED = 'transplanted',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
}

export enum UrgencyStatus {
  STATUS_1A = '1A',
  STATUS_1B = '1B',
  STATUS_2 = '2',
  STATUS_3 = '3',
  STATUS_4 = '4',
}

@Entity('recipients')
export class Recipient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @Column()
  hospitalId: string;

  @Column({
    type: 'enum',
    enum: RecipientStatus,
    default: RecipientStatus.WAITING,
  })
  status: RecipientStatus;

  @Column()
  organNeeded: string;

  @Column({
    type: 'enum',
    enum: UrgencyStatus,
    default: UrgencyStatus.STATUS_3,
  })
  urgencyStatus: UrgencyStatus;

  @Column()
  bloodType: string;

  @Column({ nullable: true })
  hlaTyping: string;

  @Column({ default: 0 })
  praLevel: number; // Panel Reactive Antibody - sensitization level

  @Column({ nullable: true })
  diagnosis: string;

  @Column({ default: 0 })
  waitingTimeMonths: number;

  @Column({ nullable: true })
  firstListingDate: Date;

  @Column({ nullable: true })
  height: number;

  @Column({ nullable: true })
  weight: number;

  @Column({ nullable: true })
  medicalNotes: string;

  @Column({ nullable: true })
  specialRequirements: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  transplantedAt: Date;

  @Column({ nullable: true })
  donorId: string;

  @ManyToOne(() => OrganDonor, { nullable: true })
  donor: OrganDonor;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
