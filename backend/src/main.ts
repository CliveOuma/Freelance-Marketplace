import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  //Enable CORS for frontend
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'your-production-frontend-url.com',
    ],
    methods: 'GET,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  app.setGlobalPrefix('api');

  const uploadDir = join(process.cwd(), 'uploads', 'submissions');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
    logger.log(`Created upload directory: ${uploadDir}`);
  }

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 8080;

  try {
    await app.listen(port);
    logger.log(`Server running on http://localhost:${port}`);
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}
bootstrap();
