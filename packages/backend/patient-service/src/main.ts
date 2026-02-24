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
    .setTitle('MediNext Patient Service')
    .setDescription('API documentation for Patient Management - Profiles, demographics, medical history')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('patients', 'Patient management endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/patients/docs', app, document);

  // Enable CORS
  app.enableCors();

  const port = process.env.PORT || 3004;
  await app.listen(port);
  console.log(`Patient Service running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/patients/docs`);
}
bootstrap();
