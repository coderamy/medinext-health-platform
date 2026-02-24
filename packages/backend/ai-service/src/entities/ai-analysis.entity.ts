import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AnalysisType {
  SYMPTOM_CHECK = 'symptom_check',
  DRUG_INTERACTION = 'drug_interaction',
  DIAGNOSTIC_ASSIST = 'diagnostic_assist',
  RISK_PREDICTION = 'risk_prediction',
  CHRONIC_MONITOR = 'chronic_monitor',
  PRESCRIPTION_ANALYSIS = 'prescription_analysis',
}

export enum AnalysisStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('ai_analyses')
export class AIAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @Column()
  providerId: string;

  @Column({
    type: 'enum',
    enum: AnalysisType,
  })
  analysisType: AnalysisType;

  @Column({
    type: 'enum',
    enum: AnalysisStatus,
    default: AnalysisStatus.PENDING,
  })
  status: AnalysisStatus;

  @Column('jsonb', { nullable: true })
  inputData: Record<string, any>;

  @Column('jsonb', { nullable: true })
  results: Record<string, any>;

  @Column({ nullable: true })
  diagnosis: string;

  @Column('simple-array', { nullable: true })
  recommendations: string[];

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  confidenceScore: number;

  @Column({ nullable: true })
  processedAt: Date;

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @Column({ default: false })
  isReviewed: boolean;

  @Column({ nullable: true })
  reviewedBy: string;

  @Column({ nullable: true })
  reviewedAt: Date;

  @Column({ nullable: true })
  reviewNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
