# Relatório das alterações — Tutorial 03

Projeto-base: `branch_27102026.3-main.zip` (Tutorial 02).

## Implementação

1. `docker-compose.yml`: adiciona RabbitMQ 4 com painel e volume persistente, mantendo PostgreSQL 16 e portas originais.
2. `.env.example`: adiciona conexão AMQP, nome da fila e URL do banco exclusivo de notificações.
3. `apps/notifications/`: novo serviço NestJS/RMQ consumindo `order.created`; confirma mensagens com ACK; envia falhas para a DLQ com NACK; grava notificações e eventos processados em transação Prisma.
4. `apps/orders/src/orders.module.ts`: preserva cliente TCP de Users e registra cliente RMQ + agendamento.
5. `apps/orders/src/orders.service.ts`: valida usuário via TCP e salva pedido e `OutboxEvent` na mesma transação. Evita publicar diretamente no método de criação do pedido.
6. `apps/orders/src/outbox.publisher.ts`: tenta publicar eventos pendentes a cada cinco segundos com `ClientProxy.emit()`.
7. `libs/contracts/src/events.ts`: tipo `OrderCreatedEvent` com identificador persistente `eventId` e data de ocorrência.
8. `prisma/orders/`: adiciona modelo `OutboxEvent` e migração incremental.
9. `prisma/notifications/`: novo banco com tabelas `ProcessedEvent` e `NotificationRecord` e migração inicial.
10. `scripts/setup-rabbitmq.cjs`: configura as filas `notifications_queue` e `notifications_dlq`, a exchange `notifications.dlx` e o roteamento de erros.
11. `scripts/ensure-notifications-db.cjs`: cria o banco novo para quem já possui volume PostgreSQL, sem resetar os bancos anteriores.
12. `scripts/test-events.mjs`: teste de publicação, recebimento, duplicação (idempotência) e DLQ.
13. `package.json`, `nest-cli.json`, `scripts/start-dev.cjs`: adicionam comando do novo microserviço e rotinas de banco/filas; os comandos anteriores permanecem.
14. `README.md`: orientações de instalação, inicialização no VS Code/PowerShell, testes e solução de erros.

## Arquivos preservados

O projeto React/Vite em `curso-ads/`, controllers do Gateway, CRUD de Users,
CRUD de Orders, DTOs existentes e migrações originais foram mantidos.

## Limitações importantes do próprio Tutorial 03

- O Outbox usa `emit()` em vez de publisher confirms, de modo que **não** fornece
  garantia completa de entrega durável. Não apresente como código pronto para produção.
- Os retries com fila TTL são um exercício futuro; apenas DLQ simples está implementada.
- O envio de e-mail é **simulado** por logs e registro em banco.
- Não há claim/lease para várias instâncias de OutboxPublisher; configure somente
  uma instância do Orders Service neste laboratório.
- Instalação npm e teste de ponta a ponta dependem de acesso ao registro npm,
  Docker e PostgreSQL/RabbitMQ funcionando no seu computador. Foram feitas
  validações estruturais e de sintaxe neste ambiente.
