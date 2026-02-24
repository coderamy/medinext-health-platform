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
    .setTitle('MediNext Lab Service')
    .setDescription('API documentation for Laboratory Management')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('labs', 'Laboratory management endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/labs/docs', app, document);

  app.enableCors();

  const port = process.env.PORT || 3008;
  await app.listen(port);
  console.log(`Lab Service running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/labs/docs`);
}

bootstrap();
