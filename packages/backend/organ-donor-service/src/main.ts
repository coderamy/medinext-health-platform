import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');
  
  const port = process.env.PORT || 3006;
  await app.listen(port);
  
  console.log(`Organ Donor Service running on port ${port}`);
}

bootstrap();
