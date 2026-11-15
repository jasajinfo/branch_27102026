# Curso ADS — Monorepositório NestJS + React

Esta versão reorganiza o frontend React/Vite do arquivo `branch_27102026-main.zip` no padrão solicitado de **monorepositório NestJS**. Os componentes CSS permanecem separados por componente.

## Estrutura

```text
nest-microservices/
├── apps/
│   ├── api-gateway/
│   │   ├── src/
│   │   │   ├── users/
│   │   │   │   ├── dto/create-user.dto.ts
│   │   │   │   └── users.controller.ts
│   │   │   ├── app.controller.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── tsconfig.app.json
│   ├── users/
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.module.ts
│   │   │   └── users.service.ts
│   │   └── tsconfig.app.json
│   └── web/             # React + Vite; mantém a página profissional
│       ├── src/
│       │   ├── components/   # JSX + CSS de cada componente
│       │   ├── styles/       # tokens.css e layout.css
│       │   └── App.jsx
│       ├── public/
│       ├── package.json
│       └── vite.config.js
├── .env.example
├── .gitignore
├── nest-cli.json
├── package.json
└── tsconfig.json
```

## 1. Instalar dependências

Abra **a pasta `nest-microservices`** no VS Code, não a pasta pai. Use Node.js 22.12+ ou 20.19+ e execute na raiz:

```powershell
npm install
```

O npm cria o arquivo `package-lock.json` na raiz. **Não execute `npm install` numa pasta sem `package.json`.**

## 2. Executar (3 terminais independentes)

Abra três terminais do VS Code, todos dentro da pasta `nest-microservices`.

**Terminal 1 — serviço TCP de usuários, porta 3001:**

```powershell
npm run start:dev:users
```

**Terminal 2 — API Gateway HTTP, porta 3000:**

```powershell
npm run start:dev:gateway
```

**Terminal 3 — site React, porta 5173:**

```powershell
npm run start:dev:web
```

- Site: http://localhost:5173/
- API: http://localhost:3000/health
- Usuários: http://localhost:3000/users

### Testar API Gateway no PowerShell

```powershell
Invoke-RestMethod http://localhost:3000/health
Invoke-RestMethod http://localhost:3000/users

$usuario = @{ name = 'Bruno'; email = 'bruno@teste.com' } | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3000/users' -Method Post -ContentType 'application/json' -Body $usuario
Invoke-RestMethod http://localhost:3000/users
```

## 3. Compilar

```powershell
npm run build
```

## 4. Como se comunicam os aplicativos

```text
Navegador: página React (localhost:5173)
                     [frontend independente]
API HTTP (localhost:3000/users)
   └── API Gateway (NestJS)
        └── TCP (localhost:3001)
             └── Users Service (NestJS)
```

**Observação:** A página React atualmente contém o catálogo de cursos local (`apps/web/src/data/courses.js`) e não consome `/users`. O backend foi acrescentado como uma base funcional separada para cumprir a arquitetura solicitada, sem alterar o catálogo e os CSS. Os dados de usuários são **temporários, em memória** e desaparecem ao reiniciar o servidor. Não há PostgreSQL ou Prisma configurados nesta versão.

## 5. CSS separado

Exemplos:

- `apps/web/src/components/Header.jsx` importa `./Header.css`
- `apps/web/src/components/Banner.jsx` importa `./Banner.css`
- `apps/web/src/components/CourseCard.jsx` importa `./CourseCard.css`
- `apps/web/src/styles/tokens.css` centraliza as variáveis de tema.

## 6. Como publicar a branch correta no GitHub

Abra o repositório local correspondente e confira `git remote -v` antes de publicar. Se esta pasta for usada como novo checkout do repositório, atualize apenas a branch desejada com:

```powershell
git status
git branch -a
git switch branch_20102026
# Depois de copiar os novos arquivos e conferir as alterações:
git add .
git commit -m "Organiza monorepo NestJS com frontend React"
git push -u origin branch_20102026
```

**Atenção:** o nome da branch deve existir no repositório correto. Não substitua automaticamente a pasta `.git` por conteúdo de ZIP; um ZIP é apenas os arquivos do projeto, não o histórico.
