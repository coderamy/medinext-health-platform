import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled',
}

export enum AppointmentType {
  CONSULTATION = 'consultation',
  FOLLOW_UP = 'follow_up',
  EMERGENCY = 'emergency',
  ROUTINE = 'routine',
  PROCEDURE = 'procedure',
  TELEMEDICINE = 'telemedicine',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @Column()
  providerId: string;

  @Column()
  hospitalId: string;

  @Column()
  departmentId: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @Column({
    type: 'enum',
    enum: AppointmentType,
    default: AppointmentType.CONSULTATION,
  })
  type: AppointmentType;

  @Column()
  scheduledStart: Date;

  @Column()
  scheduledEnd: Date;

  @Column({ nullable: true })
  actualStart: Date;

  @Column({ nullable: true })
  actualEnd: Date;

  @Column({ nullable: true })
  reasonForVisit: string;

  @Column({ nullable: true })
  symptoms: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  cancellationReason: string;

  @Column({ nullable: true })
  cancelledBy: string;

  @Column({ nullable: true })
  cancelledAt: Date;

  @Column({ default: false })
  isTelemedicine: boolean;

  @Column({ nullable: true })
  meetingLink: string;

  @Column({ nullable: true })
  rescheduledFrom: string;

  @Column({ nullable: true })
  rescheduledTo: string;

  @Column({ default: 0 })
  reminderCount: number;

  @Column({ nullable: true })
  checkedInAt: Date;

  @Column({ nullable: true })
  vitalsRecorded: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
