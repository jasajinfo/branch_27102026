import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OutboxPublisher } from './outbox.publisher';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ClientsModule.register([
      {
        name: 'USERS_SERVICE', transport: Transport.TCP,
        options: {
          host: process.env.USERS_HOST ?? '127.0.0.1',
          port: Number(process.env.USERS_PORT ?? 3001),
        },
      },
      {
        name: 'NOTIFICATIONS_CLIENT', transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://app:app123@localhost:5672'],
          queue: process.env.RABBITMQ_NOTIFICATIONS_QUEUE ?? 'notifications_queue',
          queueOptions: {
            durable: true,
            arguments: {
              'x-dead-letter-exchange': 'notifications.dlx',
              'x-dead-letter-routing-key': 'notifications.failed',
            },
          },
          persistent: true,
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, OutboxPublisher],
})
export class OrdersModule {}
