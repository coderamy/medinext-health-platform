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
    .setTitle('MediNext Insurance Service')
    .setDescription('API documentation for Insurance Management')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('insurance', 'Insurance management endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/insurance/docs', app, document);

  app.enableCors();

  const port = process.env.PORT || 3012;
  await app.listen(port);
  console.log(`Insurance Service running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/insurance/docs`);
}

bootstrap();
