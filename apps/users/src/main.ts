import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { UsersModule } from './users.module';

async function bootstrap(): Promise<void> {
  const host = process.env.USERS_HOST || '127.0.0.1';
  const port = Number(process.env.USERS_PORT || 3001);
  const app = await NestFactory.createMicroservice(UsersModule, {
    transport: Transport.TCP,
    options: { host, port },
  });
  await app.listen();
  console.log(`Microsserviço Users (TCP): ${host}:${port}`);
}

bootstrap().catch((error: unknown) => {
  console.error('Não foi possível iniciar o microsserviço Users:', error);
  process.exitCode = 1;
});
