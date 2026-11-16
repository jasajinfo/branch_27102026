import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from './prisma.service';

@Injectable()
export class OutboxPublisher {
  private readonly logger = new Logger(OutboxPublisher.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject('NOTIFICATIONS_CLIENT') private readonly client: ClientProxy,
  ) {}

  // Versão DIDÁTICA do tutorial: publicar de 5 em 5 segundos.
  // A publicação via emit() não fornece publisher confirms do broker.
  @Cron('*/5 * * * * *', { waitForCompletion: true })
  async publishPendingEvents(): Promise<void> {
    const events = await this.prisma.outboxEvent.findMany({
      where: { publishedAt: null },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });

    for (const event of events) {
      try {
        await firstValueFrom(this.client.emit(event.eventType, event.payload));
        await this.prisma.outboxEvent.update({
          where: { id: event.id },
          data: { publishedAt: new Date() },
        });
        this.logger.log(`Evento ${event.id} publicado`);
      } catch (error) {
        this.logger.error(`Erro ao publicar evento ${event.id}`, error instanceof Error ? error.stack : String(error));
      }
    }
  }
}
