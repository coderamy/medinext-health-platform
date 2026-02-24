import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('MediNext Blood Bank Service')
    .setDescription('API documentation for Blood Bank Management')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('blood-bank', 'Blood bank management endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/blood-bank/docs', app, document);

  app.enableCors();

  const port = process.env.PORT || 3010;
  await app.listen(port);
  console.log(`Blood Bank Service running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/blood-bank/docs`);
}

bootstrap();
