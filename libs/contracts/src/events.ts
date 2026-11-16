/** Identificador estável: o mesmo evento deve manter eventId em novas entregas. */
export interface OrderCreatedEvent {
  eventId: string;
  orderId: number;
  userId: number;
  total: string;
  occurredAt: string;
}
