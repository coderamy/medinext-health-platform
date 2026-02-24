import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { OrganDonor } from './organ-donor.entity';
import { Recipient } from './recipient.entity';

export enum TransplantStatus {
  PROPOSED = 'proposed',
  APPROVED = 'approved',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

@Entity('transplants')
export class Transplant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  donorId: string;

  @ManyToOne(() => OrganDonor)
  donor: OrganDonor;

  @Column()
  recipientId: string;

  @ManyToOne(() => Recipient)
  recipient: Recipient;

  @Column()
  organ: string;

  @Column({
    type: 'enum',
    enum: TransplantStatus,
    default: TransplantStatus.PROPOSED,
  })
  status: TransplantStatus;

  @Column({ nullable: true })
  proposedAt: Date;

  @Column({ nullable: true })
  approvedAt: Date;

  @Column({ nullable: true })
  surgeryStartTime: Date;

  @Column({ nullable: true })
  surgeryEndTime: Date;

  @Column({ nullable: true })
  organRecoveredAt: Date;

  @Column({ nullable: true })
  organTransplantedAt: Date;

  @Column({ nullable: true })
  hospitalId: string;

  @Column({ nullable: true })
  surgicalTeam: string;

  @Column({ nullable: true })
  organCondition: string;

  @Column({ nullable: true })
  coldIschemiaTime: number; // minutes

  @Column({ nullable: true })
  warmIschemiaTime: number; // minutes

  @Column({ nullable: true })
  outcome: string;

  @Column({ default: true })
  isSuccessful: boolean;

  @Column({ nullable: true })
  failureReason: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  postTransplantSurvivalDays: number;

  @Column({ nullable: true })
  followUpDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
