import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('MediNext Appointment Service')
    .setDescription('API documentation for Appointment Management - Scheduling, booking, calendars')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('appointments', 'Appointment management endpoints')
    .addTag('providers', 'Healthcare provider endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/appointments/docs', app, document);

  // Enable CORS
  app.enableCors();

  const port = process.env.PORT || 3003;
  await app.listen(port);
  console.log(`Appointment Service running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/appointments/docs`);
}
bootstrap();
