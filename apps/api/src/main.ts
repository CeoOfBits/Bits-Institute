import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { env } from './config/env.js';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  app.use(helmet());
  app.enableCors({
    origin: env.WEB_ORIGIN.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });
  app.set('trust proxy', 1);
  app.enableShutdownHooks();

  if (env.NODE_ENV !== 'production') {
    const doc = new DocumentBuilder()
      .setTitle('BITS Institute API')
      .setVersion('0.1')
      .addBearerAuth()
      .build();
    SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, doc));
  }

  await app.listen(env.API_PORT);
  console.log(`BITS API listening on http://localhost:${env.API_PORT}/api`);
}
await bootstrap();
