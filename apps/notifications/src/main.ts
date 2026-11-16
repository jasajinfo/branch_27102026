import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NotificationsModule } from './notifications.module';

async function bootstrap(): Promise<void> {
  const queue = process.env.RABBITMQ_NOTIFICATIONS_QUEUE ?? 'notifications_queue';
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationsModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL ?? 'amqp://app:app123@localhost:5672'],
        queue,
        // Deve corresponder exatamente à topologia declarada pelo setup-rabbitmq.cjs.
        queueOptions: {
          durable: true,
          arguments: {
            'x-dead-letter-exchange': 'notifications.dlx',
            'x-dead-letter-routing-key': 'notifications.failed',
          },
        },
        noAck: false,
        prefetchCount: 1,
      },
    },
  );
  await app.listen();
  console.log(`Notifications Service RMQ: ${queue}`);
}

void bootstrap();
