import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  const port = Number(process.env.GATEWAY_PORT || 3000);
  await app.listen(port);
  console.log(`API Gateway: http://localhost:${port}`);
}

bootstrap().catch((error: unknown) => {
  console.error('Não foi possível iniciar o API Gateway:', error);
  process.exitCode = 1;
});
