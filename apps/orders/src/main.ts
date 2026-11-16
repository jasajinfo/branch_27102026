import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { rpcValidationPipe } from '@app/contracts';
import { OrdersModule } from './orders.module';

async function bootstrap(): Promise<void> {
  const host = process.env.ORDERS_HOST ?? '127.0.0.1';
  const port = Number(process.env.ORDERS_PORT ?? 3002);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(OrdersModule, {
    transport: Transport.TCP, options: { host, port },
  });
  app.useGlobalPipes(rpcValidationPipe());
  await app.listen();
  console.log(`Orders Service TCP: ${host}:${port}`);
}
void bootstrap();
