import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';

interface User {
  id: number;
  name: string;
  email: string;
}

@Controller('users')
export class UsersController {
  constructor(@Inject('USERS_SERVICE') private readonly usersClient: ClientProxy) {}

  private async request<T>(cmd: string, data: unknown): Promise<T> {
    return firstValueFrom(
      this.usersClient.send<T>({ cmd }, data).pipe(
        timeout(5000),
        catchError(() => throwError(() => new ServiceUnavailableException('Microsserviço de usuários indisponível. Inicie npm run start:dev:users.'))),
      ),
    );
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.request<User[]>('users.findAll', {});
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.request<User | null>('users.findOne', { id });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  @Post()
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.request<User>('users.create', dto);
  }
}
