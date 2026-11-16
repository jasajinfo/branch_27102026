// Cria DLX e fila de mensagens rejeitadas ANTES de iniciar os serviços.
// Uso: npm run rabbitmq:setup (requer .env, RabbitMQ iniciado).
const amqp = require('amqplib');

async function setup() {
  const url = process.env.RABBITMQ_URL;
  if (!url) throw new Error('Defina RABBITMQ_URL em .env');
  const mainQueue = process.env.RABBITMQ_NOTIFICATIONS_QUEUE || 'notifications_queue';
  const connection = await amqp.connect(url);
  try {
    const channel = await connection.createChannel();
    try {
      await channel.assertExchange('notifications.dlx', 'direct', { durable: true });
      await channel.assertQueue('notifications_dlq', { durable: true });
      await channel.bindQueue('notifications_dlq', 'notifications.dlx', 'notifications.failed');
      await channel.assertQueue(mainQueue, {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': 'notifications.dlx',
          'x-dead-letter-routing-key': 'notifications.failed',
        },
      });
      console.log(`Filas configuradas: ${mainQueue} e notifications_dlq`);
    } finally { await channel.close().catch(() => {}); }
  } finally { await connection.close().catch(() => {}); }
}
setup().catch((error) => {
  console.error('Erro configurando RabbitMQ:', error.message);
  console.error('Se a fila já existe sem os argumentos DLX, ela não é compatível.');
  console.error('Em laboratório, esvazie/exclua a fila antiga pelo painel somente se puder perder as mensagens.');
  process.exitCode = 1;
});
