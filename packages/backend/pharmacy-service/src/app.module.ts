import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pharmacy } from './entities/pharmacy.entity';
import { PharmacyController } from './controllers/pharmacy.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'medinext',
      password: process.env.DB_PASSWORD || 'medinext_secret',
      database: process.env.DB_NAME || 'medinext',
      entities: [Pharmacy],
      synchronize: true, // Set to false in production
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([Pharmacy]),
  ],
  controllers: [PharmacyController],
  providers: [],
})
export class AppModule {}
