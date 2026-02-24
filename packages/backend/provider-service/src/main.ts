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
    .setTitle('MediNext Provider Service')
    .setDescription('API documentation for Healthcare Provider Management - Doctors, specialists, credentials')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('providers', 'Healthcare provider management endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/providers/docs', app, document);

  // Enable CORS
  app.enableCors();

  const port = process.env.PORT || 3005;
  await app.listen(port);
  console.log(`Provider Service running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/providers/docs`);
}
bootstrap();
