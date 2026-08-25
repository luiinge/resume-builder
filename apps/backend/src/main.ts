import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Resume Builder API')
    .setDescription(
      'API de gestión de perfiles, plantillas y generación de CVs',
    )
    .setVersion('0.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // El frontend compilado (si está presente, como en la imagen Docker) se
  // sirve desde el mismo proceso: backend y frontend son la misma aplicación.
  const clientDir = join(__dirname, '..', 'public');
  const clientIndex = join(clientDir, 'index.html');
  if (existsSync(clientIndex)) {
    app.useStaticAssets(clientDir);
    app.use(
      (
        req: import('express').Request,
        res: import('express').Response,
        next: import('express').NextFunction,
      ) => {
        if (req.method !== 'GET' || req.path.startsWith('/api')) {
          next();
          return;
        }
        res.sendFile(clientIndex);
      },
    );
  }

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
