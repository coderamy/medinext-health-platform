import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospital } from './entities/hospital.entity';
import { HospitalController } from './controllers/hospital.controller';
import { HospitalService } from './services/hospital.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'medinext',
      password: process.env.DB_PASSWORD || 'medinext_secret',
      database: process.env.DB_NAME || 'medinext',
      entities: [Hospital],
      synchronize: true,
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([Hospital]),
  ],
  controllers: [HospitalController],
  providers: [HospitalService],
  exports: [],
})
export class AppModule {}
