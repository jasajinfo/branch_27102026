import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from './prisma.service';

@Module({
  // Pedidos são consultados antes de remover usuários, evitando usuários órfãos.
  imports: [ClientsModule.register([{
    name: 'ORDERS_SERVICE', transport: Transport.TCP,
    options: { host: process.env.ORDERS_HOST ?? '127.0.0.1', port: Number(process.env.ORDERS_PORT ?? 3002) },
  }])],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
