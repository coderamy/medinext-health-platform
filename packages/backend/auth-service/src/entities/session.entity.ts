import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum SessionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  token: string;

  @Column({ nullable: true })
 refreshToken: string;

@Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.ACTIVE,
})
status: SessionStatus;

@Column({ nullable:true })
deviceInfo:string;
  
@Column({ nullable:true })
ipAddress:string;
  
@Column({ nullable:true }) 
userAgent:string;
  
@Column({ nullable:true })
location:string;
  
@Column()
expiresAt : Date;
    
  @CreateDateColumn()   
  createdAt : Date; 

  @UpdateDateColumn()   
  updatedAt : Date; 
  
}
