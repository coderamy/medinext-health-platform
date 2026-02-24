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
    .setTitle('MediNext Pharmacy Service')
    .setDescription('API documentation for Pharmacy Management')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('pharmacy', 'Pharmacy management endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/pharmacy/docs', app, document);

  // Enable CORS
  app.enableCors();

  const port = process.env.PORT || 3007;
  await app.listen(port);
  console.log(`Pharmacy Service running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/pharmacy/docs`);
}
bootstrap();
