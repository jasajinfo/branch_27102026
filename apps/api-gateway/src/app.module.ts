import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { UsersController } from './users/users.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USERS_HOST || '127.0.0.1',
          port: Number(process.env.USERS_PORT || 3001),
        },
      },
    ]),
  ],
  controllers: [AppController, UsersController],
})
export class AppModule {}
