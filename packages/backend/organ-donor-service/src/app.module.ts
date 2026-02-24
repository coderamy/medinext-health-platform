import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganDonorController } from './controllers/organ-donor.controller';
import { OrganDonorService } from './services/organ-donor.service';
import { OrganDonor } from './entities/organ-donor.entity';
import { Recipient } from './entities/recipient.entity';
import { Transplant } from './entities/transplant.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'medinext',
      password: process.env.DB_PASSWORD || 'medinext_secret',
      database: process.env.DB_NAME || 'medinext',
      entities: [OrganDonor, Recipient, Transplant],
      synchronize: true,
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([
      OrganDonor,
      Recipient,
      Transplant,
    ]),
  ],
  controllers: [OrganDonorController],
  providers: [
    OrganDonorService,
  ],
  exports: [OrganDonorService],
})
export class AppModule {}
