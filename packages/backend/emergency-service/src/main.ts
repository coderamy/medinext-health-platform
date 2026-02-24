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
    .setTitle('MediNext Emergency Service')
    .setDescription('API documentation for Emergency Services - Ambulance, emergency requests')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('emergency', 'Emergency management endpoints')
    .addTag('ambulances', 'Ambulance management endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/emergency/docs', app, document);

  // Enable CORS
  app.enableCors();

  const port = process.env.PORT || 3013;
  await app.listen(port);
  console.log(`Emergency Service running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/emergency/docs`);
}
bootstrap();
