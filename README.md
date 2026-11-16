# Tutoriais 03 e 04 — Microserviços NestJS + catálogo DevFlix (Prisma)

**Projeto completo, atualizado sobre o Tutorial 02.** O monorepo anterior foi preservado: API Gateway, Users, Orders, DTOs, bancos PostgreSQL existentes e frontend React/Vite (`curso-ads/`). A novidade é o serviço de notificações, a comunicação por eventos e os mecanismos de tratamento de falhas apresentados no **Tutorial 03**.

## Funcionalidades implementadas

- RabbitMQ 4 no Docker Compose, com interface de administração em `http://localhost:15672` (app / app123, **somente desenvolvimento local**).
- Microserviço `notifications` consumindo `order.created` com `@EventPattern`, `noAck: false`, `prefetchCount: 1`, `ack` e `nack`.
- `OrdersService` continua consultando o `UsersService` por **TCP**, mas cria cada pedido junto de um registro **OutboxEvent** na mesma transação Prisma.
- `OutboxPublisher` percorre o Outbox a cada **5 segundos** e publica os eventos usando `ClientProxy.emit()`.
- Dead-letter exchange `notifications.dlx` e fila `notifications_dlq` para mensagens rejeitadas (por exemplo, pedido com total `9999`).
- Contrato compartilhado `OrderCreatedEvent` com `eventId` único, `occurredAt`, `orderId`, `userId` e `total`.
- Idempotência persistida no banco `notifications_db`: as tabelas `ProcessedEvent` e `NotificationRecord` são gravadas na **mesma transação**, evitando duplicação do registro de notificação mesmo se o evento for entregue outra vez. **E-mails não são realmente enviados:** o efeito é uma gravação no banco e logs.
- Migrações SQL para Outbox e Notifications, com comandos Prisma 7 separados para os três bancos.
- Teste integrado `scripts/test-events.mjs` de publicação, idempotência e dead-letter queue.

### Estrutura principal

```text
branch_27102026.3-main/
├── apps/
│   ├── api-gateway/src/          # HTTP :3000 (mantido)
│   ├── users/src/                # TCP :3001 (mantido)
│   ├── orders/src/               # TCP :3002 + Outbox Publisher
│   └── notifications/src/        # RabbitMQ consumer, ACK/NACK, persistência
├── libs/contracts/src/          # DTOs existentes + events.ts
├── prisma/
│   ├── users/                    # users_db
│   ├── orders/                   # orders_db + OutboxEvent
│   └── notifications/            # notifications_db + idempotência
├── scripts/
│   ├── setup-rabbitmq.cjs        # Declara filas e DLQ
│   ├── ensure-notifications-db.cjs
│   ├── smoke-test.mjs            # Testes existentes
│   └── test-events.mjs           # Testes de eventos (novo)
├── curso-ads/                   # Frontend React/Vite original
├── docker-compose.yml           # PostgreSQL 16 + RabbitMQ 4
├── .env.example
└── package.json
```

## Preparação no VS Code / PowerShell (Windows)

**Pré-requisitos:** Node.js 20.19+ (recomendável Node 22 ou 24), npm e Docker Desktop iniciado. Abra **a pasta principal** (a que contém `package.json`, `apps/`, `prisma/` e `docker-compose.yml`), não `curso-ads/`.

```powershell
# Execute uma vez, na raiz do projeto:
Copy-Item .env.example .env
npm install

docker compose up -d

# O Docker cria as três bases automaticamente quando o volume é novo.
# Este comando também cria notifications_db se o volume PostgreSQL já existia:
npm run db:ensure:notifications

# As migrações EXISTENTES já estão incluídas (não recrie as migrações iniciais).
npm run db:deploy
npm run db:generate

# Crie exchange e filas ANTES de iniciar as aplicações:
npm run rabbitmq:setup
```

Se o seu PostgreSQL já está em outra porta, ajuste as três URLs `*_DATABASE_URL` no `.env`. Este projeto usa a porta **15433** por padrão, para evitar conflitos com o PostgreSQL na **15432** de outros exercícios. O comando `db:ensure:notifications` exige um usuário PostgreSQL autorizado a criar bancos.

> **Atenção:** a configuração do RabbitMQ é idêntica no script de setup, no producer e no consumer. Se você já criou a fila `notifications_queue` manualmente sem DLX, o broker pode retornar `PRECONDITION_FAILED`. No **laboratório**, e somente se não precisar das mensagens, exclua essa fila pelo painel e execute `npm run rabbitmq:setup` novamente. **Nunca exclua uma fila de produção apenas para corrigir argumentos.**

### Iniciando os quatro microserviços

Abra **quatro terminais separados** no VS Code, todos na pasta que contém o `package.json`, e execute **um comando em cada terminal**:

| Terminal | Comando | Função |
| --- | --- | --- |
| 1 | `npm run start:dev:users` | Usuários por TCP, porta 3001 |
| 2 | `npm run start:dev:orders` | Pedidos por TCP, porta 3002; Outbox de 5 em 5 s |
| 3 | `npm run start:dev:notifications` | Consumidor da fila RabbitMQ |
| 4 | `npm run start:dev:gateway` | API HTTP, porta 3000 |

Os atalhos no formato do tutorial também funcionam, como `npm run start:dev -- notifications`, `npm run start:dev -- orders`, etc.

Opcionalmente, inicie o frontend preservado em um quinto terminal com `npm run start:dev:web`, e abra `http://localhost:5173` (continua independente da API, como na versão anterior).

## Teste pelo PowerShell

Com Docker e os quatro serviços iniciados:

```powershell
# 1. Criar usuário
$usuario = Invoke-RestMethod -Method Post -Uri 'http://localhost:3000/users' `
  -ContentType 'application/json' -Body '{"name":"Ana","email":"ana-tutorial03@example.com"}'
$usuario

# 2. Criar pedido com o ID recebido; o retorno HTTP não espera a notificação
$pedido = Invoke-RestMethod -Method Post -Uri 'http://localhost:3000/orders' `
  -ContentType 'application/json' `
  -Body (@{ userId = $usuario.id; description = 'Notebook Dell'; total = 4500 } | ConvertTo-Json)
$pedido
```

No terminal `notifications`, depois que o publicador executar (até aproximadamente 5 segundos após a criação do pedido), deverão aparecer logs semelhantes a:

```text
[NotificationsService] Notificação do pedido 1
[NotificationsService] Usuário: 1
[NotificationsService] Total: R$ 4500
```

No RabbitMQ abra `http://localhost:15672`, entre com usuário `app` e senha `app123`, clique em **Queues and Streams** e observe `notifications_queue` e `notifications_dlq`.

Para **simular uma falha** e verificar a DLQ:

```powershell
Invoke-RestMethod -Method Post -Uri 'http://localhost:3000/orders' `
  -ContentType 'application/json' `
  -Body (@{ userId = $usuario.id; description = 'Teste DLQ'; total = 9999 } | ConvertTo-Json)
```

O Notifications Service lançará a falha simulada, responderá com `nack(message, false, false)`, e a mensagem será encaminhada para `notifications_dlq`. A contagem do painel pode variar se outras mensagens estiverem sendo consumidas.

**Teste integrado automatizado**, após criar as filas e iniciar os quatro serviços:

```powershell
npm run test:smoke            # Exercícios HTTP da Parte 2 (independente)
npm run test:smoke:events     # Parte 3: Outbox -> RabbitMQ -> notificação, idempotência e DLQ
```

O teste de eventos cria dados de laboratório e **não os exclui**. Para evitar erro de e-mail repetido, o teste gera um endereço único a cada execução.

## Funcionamento simplificado

```text
POST /orders (HTTP, Gateway)
          |
          v
Orders Service --TCP/send()--> Users Service (confere o usuário)
          |
          v
PostgreSQL orders_db (uma única transação)
       Order + OutboxEvent(eventId, order.created)
          |
          v
OutboxPublisher (a cada 5 segundos)
          |
          v
RabbitMQ --> notifications_queue
                      |
                      v
              Notifications Service
                      |  sucesso: registra efeito uma vez, ACK
                      |  falha:   NACK sem requeue
                      v
                notifications_dlq (quando falha)
```

### Observações técnicas e limites do tutorial

- `emit()` **não é uma garantia de publisher confirm** durável. O publicador é a implementação **didática solicitada pelo tutorial**: ao receber retorno do Observable ele marca `publishedAt`, mas ainda existe uma pequena janela de risco de perda. Para produção, usar canal AMQP com **publisher confirms**, confirmação de roteamento e só depois marcar o evento como publicado.
- Em múltiplas instâncias do Orders Service, um **claim/lease** ou bloqueio por transação deve impedir que vários publicadores selecionem o mesmo Outbox ao mesmo tempo. O código atual é adequado a uma única instância para estudo.
- A DLQ foi implementada; **retries com TTL não foram adicionados**, pois o próprio Tutorial 03 os apresenta como exercício futuro e explica os riscos de um ciclo de reenvio infinito.
- A idempotência protege o efeito **persistido** (NotificationRecord). Se no futuro enviar e-mail/SMS a um serviço externo, será necessária também chave idempotente no provedor ou uma estratégia de entregas para evitar duplicidades no efeito externo.
- RabbitMQ e credenciais de desenvolvimento aqui demonstradas não devem ser expostos à Internet.

## Resolução de problemas

| Mensagem / situação | Ação |
| --- | --- |
| `Cannot find module` / `@nestjs/schedule` / `amqplib` | Execute `npm install` na raiz. Este ZIP não inclui `node_modules`. |
| `PrismaClient ... generated` / TypeScript não acha `generated/*` | Execute `npm run db:generate`. |
| `database notifications_db does not exist` | Execute `npm run db:ensure:notifications` e depois `npm run db:deploy`. |
| `relation "OutboxEvent" does not exist` | Execute `npm run db:deploy` para aplicar a migração incremental. |
| `PRECONDITION_FAILED - inequivalent arg` na fila RabbitMQ | Fila antiga sem DLX: veja aviso sobre exclusão apenas em laboratório, acima. |
| `ECONNREFUSED 5672` | Ligue Docker Desktop, `docker compose up -d`, revise `RABBITMQ_URL`. |
| `EADDRINUSE:3001/3002/3000` | Termine processos anteriores ou ajuste `USERS_PORT` / `ORDERS_PORT` / `GATEWAY_PORT`. |
| Pedido criado mas sem log de notificação | Confira se notifications está iniciado, fila declarada e OutboxPublisher rodando; verifique o painel RabbitMQ e a DLQ. |

## Compilação

```powershell
npm run build
```

Para atualizar seu repositório no GitHub, abra primeiro o **repositório local correto**, confirme `git remote -v` e `git branch --show-current`, faça `git add .`, `git commit -m "Implementa Tutorial 03 RabbitMQ e Outbox"` e `git push -u origin NOME_DA_BRANCH`. Não execute `git init` dentro de uma pasta já clonada. A pasta extraída do ZIP não contém histórico `.git`.

### Sobre o arquivo de dependências

O `package-lock.json` veio da versão anterior do projeto. Como o Tutorial 03
adicionou três bibliotecas (`@nestjs/schedule`, `amqplib`,
`amqp-connection-manager`), **execute `npm install` na raiz** antes de iniciar
o projeto; o npm atualizará automaticamente o lockfile. **Não comece por
`npm ci`** enquanto o lockfile não tiver sido atualizado e salvo. O ambiente
de preparação deste ZIP não pôde acessar o registro npm, portanto não foi
possível atualizar o lockfile nem realizar um teste integrado com as novas
dependências aqui. As sintaxes dos arquivos `.ts`, `.cjs` e `.mjs` foram
verificadas localmente.


---

## Tutorial 04 — Catálogo de categorias, cursos e aulas (Branch_10112026)

A base enviada é um **monorepo NestJS**, e não o projeto `devflix/backend` mostrado
no texto da aula. Por isso, a adaptação foi feita dentro do monorepo, sem modificar os
serviços Users, Orders, Notifications, suas bases anteriores ou o frontend `curso-ads`.

### O que foi acrescentado

| Recurso do tutorial | Local adaptado neste repositório |
|---|---|
| `Category`, `Course` e `Lesson` | `prisma/catalog/schema.prisma` |
| Migration incremental | `prisma/catalog/migrations/20261115011000_add_courses_lessons/` |
| Seed com `upsert` | `prisma/catalog/seed.ts` |
| `CoursesService` e `CoursesController` | `apps/api-gateway/src/courses/` |
| Configuração Prisma 7 | `prisma/catalog.config.ts` |
| API HTTP | `http://localhost:3000/courses` e `/courses/:id` |

A configuração do Prisma é **CommonJS**, igual aos demais serviços deste repositório;
o material didático pressupõe um projeto ESM com imports terminados em `.js`. O seed
usa `ts-node` já instalado em vez de `tsx` para preservar as dependências do projeto.

### Instalação no VS Code (PowerShell)

Abra o terminal **na raiz** da pasta `Branch_10112026`, onde estão `package.json` e
`docker-compose.yml`. Em instalações novas:

```powershell
Copy-Item .env.example .env
npm install
# Docker Desktop precisa estar aberto:
docker compose up -d
# Os dois comandos abaixo não apagam dados existentes:
npm run db:ensure:notifications
npm run db:ensure:catalog
npm run db:deploy
npm run db:generate
npm run db:seed:catalog
```

**Se você já possui `.env` no seu computador**, não o substitua: acrescente apenas
`CATALOG_DATABASE_URL="postgresql://postgres:postgres@localhost:15433/catalog_db?schema=public"`
e preserve suas configurações anteriores e a senha/porta reais do PostgreSQL.

**Não use** `prisma migrate reset`. Se o banco já existia, as migrations verificam
quais mudanças estão pendentes. `db:ensure:catalog` cria apenas o novo banco se faltar.

Para iniciar os microserviços anteriores e o Gateway, abra quatro terminais separados
na raiz e execute, respectivamente:

```powershell
npm run start:dev:users
npm run start:dev:orders
npm run start:dev:notifications
npm run start:dev:gateway
```

Os endpoints do catálogo estão no **Gateway**, na porta 3000. Para conferir em
outro terminal PowerShell:

```powershell
Invoke-RestMethod http://localhost:3000/health
Invoke-RestMethod http://localhost:3000/courses
Invoke-RestMethod http://localhost:3000/courses/1
```

O ID `1` é ilustrativo: consulte `/courses` para ver os IDs realmente gravados.
Testes de erro:

```powershell
# 404: curso inexistente
try { Invoke-WebRequest http://localhost:3000/courses/999999 } catch { $_.Exception.Response.StatusCode }
# 400: identificador inválido
try { Invoke-WebRequest http://localhost:3000/courses/abc } catch { $_.Exception.Response.StatusCode }
```

### Testes e validação

```powershell
npm run db:validate:catalog        # valida o schema Prisma 7
npm run db:generate:catalog        # gera o client Prisma 7
npm run test                       # 3 testes unitários sem acesso ao banco
npm run build                      # compila os serviços originais e o catálogo
npm run test:smoke:catalog         # precisa do banco populado + Gateway funcionando
npm run db:seed:catalog            # pode repetir sem duplicar registros
```

Também é possível inspecionar com PostgreSQL:

```powershell
docker exec -it postgres-curso-ads psql -U postgres -d catalog_db
```

No prompt `psql`, use `\dt`, `\d "Course"`, `\d "Lesson"` e saia com `\q`.
Para conferir os JOINs, a quantidade de aulas e as regras das chaves estrangeiras, execute:

```powershell
Get-Content scripts/verify-catalog.sql | docker exec -i postgres-curso-ads psql -U postgres -d catalog_db
```

Uma categoria que possui cursos não poderá ser apagada (Restrict); aulas de um
curso são apagadas em cascata, conforme o tutorial. O par `(courseId, position)` é único.

### Publicar **apenas** a branch Branch_10112026 no GitHub

Se o repositório original já está clonado, copie os arquivos alterados deste ZIP para
**a pasta do clone que contém `.git`**. A branch não é criada automaticamente por um ZIP.
No terminal dessa pasta, após conferir se está no repositório correto:

```powershell
git remote -v
git status
git switch -c Branch_10112026
git add .
git commit -m "Tutorial 04: catalogo de cursos e aulas com Prisma"
git push -u origin Branch_10112026
git ls-remote --heads origin Branch_10112026
```

Se a branch já existir localmente, use `git switch Branch_10112026` em vez de
`git switch -c`. O último comando confirma a presença da branch no servidor.
Acesse a branch pelo seletor **main** na página do GitHub. Não faça `push` na
`main` ou em `tutorial03` se a entrega deve permanecer apenas nesta branch.

> **Observação:** este tutorial acrescenta o backend do catálogo. A interface
> React/Vite `curso-ads/` permanece funcional com os dados estáticos anteriores;
> conectá-la a `/courses` não foi solicitado nesta etapa do material.
