import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom, timeout, TimeoutError } from 'rxjs';
import { CreateOrderDto, OrderCreatedEvent, UpdateOrderDto } from '@app/contracts';
import { PrismaService } from './prisma.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
  ) {}

  /** Sem joins entre bancos: valida a existência do usuário por TCP. */
  private async ensureUserExists(userId: number): Promise<void> {
    try {
      const user = await firstValueFrom(this.usersClient.send('users.findOne', userId).pipe(timeout(3000)));
      if (!user) throw rpc(400, 'Usuário inválido');
    } catch (error) {
      if (error instanceof RpcException) throw error;
      if (error instanceof TimeoutError) throw rpc(503, 'Serviço de usuários demorou a responder');
      const remote = error as { statusCode?: number } | null;
      if (remote?.statusCode === 404) throw rpc(400, 'Usuário inexistente; pedido não criado');
      throw rpc(503, 'Não foi possível verificar o usuário');
    }
  }

  async create(data: CreateOrderDto) {
    await this.ensureUserExists(data.userId);
    // Pedido e evento são persistidos atomicamente no orders_db.
    // Não publicamos diretamente aqui: o agendador envia os eventos pendentes.
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: data.userId,
          description: data.description,
          total: data.total,
        },
      });
      const event: OrderCreatedEvent = {
        eventId: randomUUID(),
        orderId: order.id,
        userId: order.userId,
        total: order.total.toString(),
        occurredAt: new Date().toISOString(),
      };
      await tx.outboxEvent.create({
        data: { id: event.eventId, eventType: 'order.created', payload: { ...event } },
      });
      return order;
    });
  }
  findAll() { return this.prisma.order.findMany({ orderBy: { id: 'asc' } }); }
  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw rpc(404, 'Pedido não encontrado');
    return order;
  }
  findByUser(userId: number) {
    return this.prisma.order.findMany({ where: { userId }, orderBy: { id: 'asc' } });
  }
  async update(id: number, data: UpdateOrderDto) {
    await this.findOne(id);
    if (data.userId !== undefined) await this.ensureUserExists(data.userId);
    try { return await this.prisma.order.update({ where: { id }, data }); }
    catch (error) {
      if (dbCode(error) === 'P2025') throw rpc(404, 'Pedido não encontrado');
      throw error;
    }
  }
  async remove(id: number) {
    await this.findOne(id);
    try { return await this.prisma.order.delete({ where: { id } }); }
    catch (error) {
      if (dbCode(error) === 'P2025') throw rpc(404, 'Pedido não encontrado');
      throw error;
    }
  }
}
function rpc(statusCode: number, message: string): RpcException { return new RpcException({ statusCode, message }); }
function dbCode(err: unknown): string | undefined { return typeof err === 'object' && err !== null && 'code' in err ? String(err.code) : undefined; }
