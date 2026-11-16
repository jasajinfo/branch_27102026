import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { rpcValidationPipe } from '@app/contracts';
import { UsersModule } from './users.module';

async function bootstrap(): Promise<void> {
  const host = process.env.USERS_HOST ?? '127.0.0.1';
  const port = Number(process.env.USERS_PORT ?? 3001);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UsersModule, {
    transport: Transport.TCP, options: { host, port },
  });
  app.useGlobalPipes(rpcValidationPipe());
  await app.listen();
  console.log(`Users Service TCP: ${host}:${port}`);
}
void bootstrap();
