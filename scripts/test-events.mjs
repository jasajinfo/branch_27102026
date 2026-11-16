/**
 * Teste integrado do Tutorial 03. Pré-requisitos: PostgreSQL, RabbitMQ, quatro
 * aplicações NestJS e migrações já aplicadas. Não remove dados de teste.
 * Uso: npm run test:smoke:events
 */
import 'dotenv/config';
import assert from 'node:assert/strict';
import amqp from 'amqplib';
import { Client } from 'pg';

const base = `http://localhost:${process.env.GATEWAY_PORT || 3000}`;
const rabbitQueue = process.env.RABBITMQ_NOTIFICATIONS_QUEUE || 'notifications_queue';
const dbOrders = new Client({ connectionString: process.env.ORDERS_DATABASE_URL });
const dbNotifications = new Client({ connectionString: process.env.NOTIFICATIONS_DATABASE_URL });

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function waitFor(label, predicate, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await predicate()) return;
    await wait(700);
  }
  throw new Error(`Tempo esgotado aguardando ${label}`);
}
async function post(path, body) {
  const response = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await response.json();
  assert.equal(response.status, 201, `${path}: ${JSON.stringify(json)}`);
  return json;
}

await dbOrders.connect();
await dbNotifications.connect();
let connection;
try {
  connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createConfirmChannel();
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const user = await post('/users', { name: 'Teste Tutorial 03', email: `evento-${suffix}@example.com` });
  const order = await post('/orders', { userId: user.id, description: 'Pedido evento válido', total: 4500 });
  assert.ok(order.id);
  console.log(`Pedido criado: #${order.id}; aguardando Outbox -> RabbitMQ -> Notifications.`);

  await waitFor('evento publicado pelo Outbox', async () => {
    const { rows } = await dbOrders.query('SELECT * FROM "OutboxEvent" WHERE "eventType" = $1 AND payload->>\'orderId\' = $2 AND "publishedAt" IS NOT NULL', ['order.created', String(order.id)]);
    return rows.length > 0;
  });
  await waitFor('notificação registrada no banco', async () => {
    const { rows } = await dbNotifications.query('SELECT COUNT(*)::int AS count FROM "NotificationRecord" WHERE "orderId" = $1', [order.id]);
    return rows[0].count === 1;
  });
  const outbox = await dbOrders.query('SELECT id, payload FROM "OutboxEvent" WHERE payload->>\'orderId\' = $1', [String(order.id)]);
  assert.equal(outbox.rows.length, 1);
  const event = outbox.rows[0];
  assert.equal(event.id, event.payload.eventId);

  // Simula uma segunda entrega com o MESMO eventId; o consumidor deve ignorar.
  const packet = Buffer.from(JSON.stringify({ pattern: 'order.created', data: event.payload }));
  channel.sendToQueue(rabbitQueue, packet, { persistent: true });
  await channel.waitForConfirms();
  await wait(1700);
  const { rows: duplicate } = await dbNotifications.query('SELECT COUNT(*)::int AS count FROM "NotificationRecord" WHERE "eventId" = $1', [event.id]);
  assert.equal(duplicate[0].count, 1, 'O evento repetido não pode duplicar a notificação');
  console.log('OK: idempotência (mesmo eventId, uma notificação).');

  const failed = await post('/orders', { userId: user.id, description: 'Teste DLQ', total: 9999 });
  await waitFor('evento rejeitado na DLQ', async () => {
    const { rows } = await dbOrders.query('SELECT "publishedAt" FROM "OutboxEvent" WHERE payload->>\'orderId\' = $1', [String(failed.id)]);
    if (!rows[0]?.publishedAt) return false;
    const rabbitUrl = new URL(process.env.RABBITMQ_URL);
    const credentials = Buffer.from(`${decodeURIComponent(rabbitUrl.username)}:${decodeURIComponent(rabbitUrl.password)}`).toString('base64');
    const result = await fetch('http://localhost:15672/api/queues/%2F/notifications_dlq', { headers: { authorization: `Basic ${credentials}` } });
    if (!result.ok) throw new Error(`Painel RabbitMQ ${result.status}; verifique porta 15672`);
    const info = await result.json();
    return (info.messages ?? 0) >= 1;
  });
  console.log('OK: total 9999 gera NACK e chega à notifications_dlq.');
  console.log('Tutorial 03: fluxo, Outbox, idempotência e DLQ confirmados.');
} finally {
  if (connection) await connection.close();
  await dbOrders.end();
  await dbNotifications.end();
}
