import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { OrderCreatedEvent } from '@app/contracts';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('order.created')
  async handleOrderCreated(
    @Payload() data: OrderCreatedEvent,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    try {
      await this.notificationsService.sendOrderNotification(data);
      channel.ack(message); // Somente após a persistência da notificação.
    } catch (error) {
      this.logger.error('Falha ao processar order.created; mensagem enviada à DLQ', error instanceof Error ? error.stack : String(error));
      channel.nack(message, false, false); // Não requeue: evita loop infinito.
    }
  }
}
