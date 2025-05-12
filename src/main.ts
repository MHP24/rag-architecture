import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { envs } from './config';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // * Config
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Document Service')
    .setDescription('Webservice to create and download files')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // * Save docs as JSON
  writeFileSync('tmp/swagger-spec.json', JSON.stringify(document, null, 2));

  SwaggerModule.setup('docs', app, document);

  await app.listen(envs.port);
}
bootstrap();
