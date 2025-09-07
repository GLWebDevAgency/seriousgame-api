import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cfg = app.get(ConfigService);

  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 100,
    }),
  );
  app.enableCors({
    origin: '*',
    methods: 'GET,POST',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const docConfig = new DocumentBuilder()
    .setTitle('Serious Game API')
    .setDescription('API REST pour auth, progression, leaderboard, et matches')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup('api', app, document);

  const port = cfg.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`API running on http://localhost:${port} (Swagger: /api)`);
}

bootstrap().catch((err) => {
  console.error('Error during application bootstrap', err);
  process.exit(1);
});
