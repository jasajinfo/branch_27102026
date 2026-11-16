import { Injectable, Logger } from '@nestjs/common';
import { OrderCreatedEvent } from '@app/contracts';
import { PrismaService } from './prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Simula o envio de uma notificação e grava sua representação no banco.
   * A unicidade de ProcessedEvent.eventId evita efeitos duplicados sob concorrência.
   * Um e-mail real precisa de idempotência no provedor ou gestão de entregas.
   */
  async sendOrderNotification(data: OrderCreatedEvent): Promise<void> {
    if (!data.eventId || !Number.isInteger(data.orderId) || !Number.isInteger(data.userId) || typeof data.total !== 'string') {
      throw new Error('Evento order.created inválido');
    }

    // Falha intencional do Tutorial 03: o NACK encaminhará este evento para a DLQ.
    if (data.total === '9999') throw new Error('Falha simulada (total 9999)');

    let inserted = false;
    try {
      await this.prisma.$transaction(async (tx) => {
        // A inserção usa chave primária única; duas entregas concorrentes não passam.
        await tx.processedEvent.create({ data: { eventId: data.eventId } });
        await tx.notificationRecord.create({
          data: {
            eventId: data.eventId,
            orderId: data.orderId,
            userId: data.userId,
            total: data.total,
          },
        });
      });
      inserted = true;
    } catch (error) {
      if (dbCode(error) !== 'P2002') throw error;
      // Registro único já existe: foi uma reentrega, não notificar novamente.
      this.logger.log(`Evento ${data.eventId} já processado (idempotência)`);
    }

    if (inserted) {
      this.logger.log(`Notificação do pedido ${data.orderId}`);
      this.logger.log(`Usuário: ${data.userId}`);
      this.logger.log(`Total: R$ ${data.total}`);
    }
  }
}

function dbCode(err: unknown): string | undefined {
  return typeof err === 'object' && err !== null && 'code' in err
    ? String(err.code)
    : undefined;
}
