Curso ADS — Monorepositório NestJS + React
Projeto de exemplo organizado em monorepositório, com dois aplicativos NestJS no backend e uma interface de cursos desenvolvida com React e Vite. O objetivo é demonstrar a comunicação entre API Gateway e microsserviço de usuários, mantendo o frontend e seus arquivos CSS organizados.
Tecnologias utilizadas
- Backend: Node.js, NestJS 11, TypeScript e comunicação TCP (@nestjs/microservices).
- Frontend: React 19, Vite 8, JavaScript/JSX e CSS separado por componente.
- Gerenciamento: npm com workspace em apps/web.
- Persistência: usuários armazenados apenas em memória nesta versão (sem banco de dados).
Estrutura do projeto
nest-microservices/
├── apps/
│   ├── api-gateway/                # Aplicação NestJS que recebe requisições HTTP
│   │   ├── src/
│   │   │   ├── users/
│   │   │   │   ├── dto/
│   │   │   │   │   └── create-user.dto.ts
│   │   │   │   └── users.controller.ts
│   │   │   ├── app.controller.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── tsconfig.app.json
│   ├── users/                      # Microsserviço NestJS de usuários (TCP)
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.module.ts
│   │   │   └── users.service.ts
│   │   └── tsconfig.app.json
│   └── web/                        # Interface React + Vite
│       ├── public/
│       ├── src/
│       │   ├── components/         # Componentes .jsx e CSS correspondentes
│       │   ├── data/
│       │   │   └── courses.js      # Catálogo de cursos local
│       │   ├── styles/
│       │   │   ├── layout.css
│       │   │   └── tokens.css
│       │   ├── App.jsx
│       │   ├── App.css
│       │   ├── index.css
│       │   └── main.jsx
│       ├── package.json
│       └── vite.config.js
├── .env.example
├── .gitignore
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
Responsabilidade de cada aplicação
Aplicação	Função	Porta padrão
api-gateway	Recebe requisições HTTP e encaminha operações de usuários ao microsserviço	3000
users	Processa os comandos de listar, consultar e cadastrar usuários por TCP	3001
web	Exibe catálogo de cursos com busca, filtros e vídeos	5173


Importante: nesta implementação, o frontend utiliza dados locais de apps/web/src/data/courses.js e não está integrado à API /users. O backend funciona como um exemplo independente da arquitetura de microsserviços.

Pré-requisitos
- Node.js: versão 20.19+ ou 22.12+ (recomendado utilizar versão LTS compatível).
- npm: instalado junto do Node.js.
- Visual Studio Code (opcional, recomendado para desenvolvimento).
No terminal do VS Code, verifique:
node -v
npm -v
Instalação
1. Extraia o arquivo ZIP do projeto.
2. No VS Code, use Arquivo > Abrir Pasta e selecione nest-microservices.
3. No terminal, confirme que está na pasta que contém o package.json da raiz.
4. Instale as dependências:
npm install
Execute a instalação na raiz nest-microservices, não dentro de apps/api-gateway ou apps/users. O npm utiliza o package.json da raiz e o workspace do frontend.

Configuração opcional de ambiente
O projeto contém .env.example com as configurações de referência:
GATEWAY_PORT=3000
USERS_HOST=127.0.0.1
USERS_PORT=3001
CORS_ORIGIN=http://localhost:5173
Os valores acima já estão previstos como padrões no código. A simples criação de um arquivo .env não o carrega automaticamente nesta versão, pois não há um carregador de .env configurado no NestJS. Para alterar portas durante uma sessão do PowerShell, defina as variáveis de ambiente no terminal de cada processo antes de executá-lo (e mantenha USERS_HOST e USERS_PORT iguais no Gateway e no Users).
Como executar
Abra três terminais no VS Code, todos posicionados na raiz nest-microservices.
Terminal 1 — Microsserviço de usuários
npm run start:dev:users
O serviço inicia no endereço TCP 127.0.0.1:3001. Essa porta não é um site HTTP; ela é usada para comunicação interna com o Gateway.
Terminal 2 — API Gateway
npm run start:dev:gateway
API HTTP disponível, por padrão, em http://localhost:3000.
Terminal 3 — Frontend React
npm run start:dev:web
No navegador, acesse o endereço informado pelo Vite (normalmente http://localhost:5173/).
Visão geral da comunicação
Navegador
   │
   ├── http://localhost:5173 ──> React/Vite (catálogo local de cursos)
   │
   └── http://localhost:3000 ──> API Gateway (NestJS)
                                       │
                                       └── TCP 127.0.0.1:3001
                                               │
                                               └── Users Service (NestJS)
                                                      └── Lista em memória
Rotas da API
Método	Rota	Descrição
GET	/health	Verifica se o API Gateway responde
GET	/users	Lista todos os usuários cadastrados
GET	/users/:id	Consulta um usuário pelo identificador numérico
POST	/users	Cadastra um usuário com name e email


Testes pelo PowerShell
Com o Users e o Gateway em execução, abra outro terminal:

1. Verificar funcionamento do Gateway
Invoke-RestMethod -Uri "http://localhost:3000/health"
Resposta esperada:
{
  "status": "ok",
  "service": "api-gateway"
}
2. Consultar usuários cadastrados
Invoke-RestMethod -Uri "http://localhost:3000/users"
3. Cadastrar um usuário
$usuario = @{
    name = "Bruno"
    email = "bruno@teste.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/users" `
    -Method Post `
    -ContentType "application/json" `
    -Body $usuario
4. Consultar o usuário de ID 1
Invoke-RestMethod -Uri "http://localhost:3000/users/1"
O cadastro é temporário: os usuários desaparecem quando o microsserviço users é reiniciado.

CSS organizado por componente
A apresentação visual do site está separada da lógica React. Exemplos:
Componente React	Arquivo de estilos
Header.jsx	Header.css
Banner.jsx	Banner.css
CourseCard.jsx	CourseCard.css
Footer.jsx	Footer.css
VideoPlayer.jsx	VideoPlayer.css


Esses arquivos estão em apps/web/src/components/. As variáveis globais de cores e espaçamentos ficam em apps/web/src/styles/tokens.css, enquanto layout.css centraliza estilos de layout compartilhados.
Outros comandos úteis
Execute a partir da pasta raiz:
# Compilar backend e frontend
npm run build

# Compilar somente o Gateway
npm run build:gateway

# Compilar somente o Users
npm run build:users

# Compilar somente o frontend
npm run build:web

# Verificar o frontend com oxlint
npm run lint:web
Solução de problemas
Erro ENOENT: Could not read package.json: o terminal não está na pasta correta. Execute Get-ChildItem -Name e procure o package.json na raiz nest-microservices.

Erro ECONNREFUSED ou indisponibilidade em /users: verifique se npm run start:dev:users está em execução e se ambos os serviços utilizam as mesmas configurações TCP.

Erro EADDRINUSE: a porta já está ocupada por outro processo. Encerre o processo antigo ou altere as variáveis de porta, mantendo os serviços sincronizados.

O frontend abre, mas a API não responde: os três aplicativos são iniciados de forma independente. Certifique-se de que os terminais do Gateway e do Users estão ativos.

O servidor Vite usa outra porta: utilize o endereço Local mostrado no próprio terminal, em vez de presumir que será sempre 5173.
Limitações e próximas melhorias
Esta é uma base didática de microsserviços. Ainda não há persistência em PostgreSQL, autenticação, testes automatizados nem integração do catálogo React com a API. Futuras evoluções podem incluir Prisma, banco de dados, gestão de cursos pela API e testes de integração.
Projeto acadêmico — Curso ADS. Documentação referente à estrutura e aos comandos disponibilizados neste repositório.
