import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto, UpdateOrderDto } from '@app/contracts';
import { rpcRequest } from './rpc-request';

@Controller('orders')
export class OrdersController {
  constructor(@Inject('ORDERS_SERVICE') private readonly client: ClientProxy) {}

  @Post()
  create(@Body() dto: CreateOrderDto) { return rpcRequest(this.client, 'orders.create', dto); }

  @Get()
  findAll() { return rpcRequest(this.client, 'orders.findAll', {}); }

  // Extensão do exercício: esta rota deve preceder '/:id'.
  @Get('user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return rpcRequest(this.client, 'orders.findByUser', userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return rpcRequest(this.client, 'orders.findOne', id); }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderDto) {
    return rpcRequest(this.client, 'orders.update', { id, data: dto });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return rpcRequest(this.client, 'orders.remove', id); }
}
