import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientController } from './controllers/patient.controller';
import { PatientService } from './services/patient.service';
import { Patient } from './entities/patient.entity';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'medinext',
      password: process.env.DB_PASSWORD || 'medinext_secret',
      database: process.env.DB_NAME || 'medinext',
      entities: [Patient],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([Patient]),
  ],
  controllers: [PatientController, HealthController],
  providers: [PatientService],
  exports: [PatientService],
})
export class AppModule { }
