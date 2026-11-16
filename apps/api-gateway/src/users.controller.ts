import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto, UpdateUserDto } from '@app/contracts';
import { rpcRequest } from './rpc-request';

@Controller('users')
export class UsersController {
  constructor(@Inject('USERS_SERVICE') private readonly client: ClientProxy) {}

  @Post()
  create(@Body() dto: CreateUserDto) { return rpcRequest(this.client, 'users.create', dto); }

  @Get()
  findAll() { return rpcRequest(this.client, 'users.findAll', {}); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return rpcRequest(this.client, 'users.findOne', id); }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return rpcRequest(this.client, 'users.update', { id, data: dto });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return rpcRequest(this.client, 'users.remove', id); }
}
