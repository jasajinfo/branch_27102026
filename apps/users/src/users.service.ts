import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom, timeout, TimeoutError } from 'rxjs';
import { CreateUserDto, UpdateUserDto } from '@app/contracts';
import { PrismaService } from './prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('ORDERS_SERVICE') private readonly ordersClient: ClientProxy,
  ) {}

  async create(data: CreateUserDto) {
    try { return await this.prisma.user.create({ data }); }
    catch (error) {
      if (dbCode(error) === 'P2002') throw rpc(409, 'E-mail já cadastrado');
      throw error;
    }
  }
  findAll() { return this.prisma.user.findMany({ orderBy: { id: 'asc' } }); }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw rpc(404, 'Usuário não encontrado');
    return user;
  }

  async update(id: number, data: UpdateUserDto) {
    await this.findOne(id);
    try { return await this.prisma.user.update({ where: { id }, data }); }
    catch (error) {
      if (dbCode(error) === 'P2002') throw rpc(409, 'E-mail já cadastrado');
      if (dbCode(error) === 'P2025') throw rpc(404, 'Usuário não encontrado');
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    // Exercício: não excluir usuários que possuem pedidos. Sem consulta direta ao banco Orders.
    let orders: unknown;
    try {
      orders = await firstValueFrom(this.ordersClient.send('orders.findByUser', id).pipe(timeout(3000)));
    } catch (error) {
      if (error instanceof TimeoutError) throw rpc(503, 'Serviço de pedidos demorou a responder');
      throw rpc(503, 'Serviço de pedidos indisponível; exclusão cancelada');
    }
    if (Array.isArray(orders) && orders.length > 0) throw rpc(409, 'Usuário possui pedidos e não pode ser excluído');
    try { return await this.prisma.user.delete({ where: { id } }); }
    catch (error) {
      if (dbCode(error) === 'P2025') throw rpc(404, 'Usuário não encontrado');
      throw error;
    }
  }
}
function rpc(statusCode: number, message: string): RpcException { return new RpcException({ statusCode, message }); }
function dbCode(err: unknown): string | undefined { return typeof err === 'object' && err !== null && 'code' in err ? String(err.code) : undefined; }
