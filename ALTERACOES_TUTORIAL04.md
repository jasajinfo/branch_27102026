# Alterações — Tutorial 04 — Branch_10112026

**Projeto de origem:** `branch_27102026-tutorial03.zip` (monorepo NestJS/React do Tutorial 03).

## Adaptação importante ao projeto realmente enviado

O Tutorial 04 fornecido descreve `devflix/backend/prisma/` com uma tabela `Category` já criada.
Porém, o ZIP recebido **não possui** a estrutura `backend/`, a tabela `Category` ou o Prisma
desse projeto. Ele contém `apps/api-gateway`, `apps/users`, `apps/orders`, `apps/notifications`,
três bancos separados e `curso-ads`. Assim, **não foi substituído** o monorepo por outro projeto.

Foi acrescentado um **banco `catalog_db` isolado**, com a mesma modelagem Category/Course/Lesson,
duas migrations versionadas (`init_categories` e `add_courses_lessons`) e o módulo `CoursesModule`
no Gateway HTTP existente. O caminho real é `apps/api-gateway/src/courses/`, em vez de
`backend/src/courses/`. O frontend existente continua preservado e independente.

## Implementado

1. `prisma/catalog/schema.prisma`: modelos `Category`, `Course` e `Lesson` com 1:N, FK,
   `Restrict` para categoria, `Cascade` para aulas, índices e posição única por curso.
2. `prisma/catalog/migrations/`: migration inicial de `Category` e incremental de `Course/Lesson`.
   As migrations originais dos outros bancos permanecem intactas.
3. `prisma/catalog.config.ts`: conexão via `CATALOG_DATABASE_URL`, migrations e seed.
   Em lugar de `tsx` do material, usa **ts-node já existente** para não introduzir uma dependência
   incompatível com o `package-lock.json` fornecido.
4. `prisma/catalog/seed.ts`: `upsert` idempotente para 3 categorias, 3 cursos e 4 aulas
   com os mesmos dados ilustrativos de vídeo do tutorial.
5. `apps/api-gateway/src/courses/`: módulo, controller, service e provider de Prisma isolado.
   Endpoints: `GET /courses` e `GET /courses/:id` retornam categoria e aulas, 404 ou 400.
6. `scripts/ensure-catalog-db.cjs`: criação segura de `catalog_db` mesmo com volume Docker antigo.
7. `scripts/test-catalog.mjs`: testes HTTP de leitura, relacionamento, ordenação e erros.
8. `courses.service.spec.ts`: três testes unitários com `node:test` e mocks, sem banco.
   Adaptação do exemplo Vitest do tutorial, evitando instalação de dependências extras.
9. `package.json`, `.env.example` e script SQL do Docker: novo banco e comandos
   mantendo os fluxos do Tutorial 03.
10. `scripts/verify-catalog.sql`: consultas relacionais e verificação de constraints, sem escrever no banco.
    11. `README.md`: instruções específicas para execução no VS Code, verificação e envio ao GitHub.

## Preservação e limitações

- Nada foi enviado ao GitHub por este arquivo ZIP: você precisará criar e publicar a branch.
- **Nunca execute** `prisma migrate reset` para instalar estas alterações.
- **Não existe banco de dados ou volume Docker dentro do ZIP.** Se havia dados Category em
  outro projeto DevFlix, estes não serão automaticamente transportados para `catalog_db`.
- O catálogo é uma API pronta para consumo pelo frontend, mas `curso-ads` ainda usa dados estáticos.
- As URLs de vídeo são exemplos do material do curso; confira incorporação antes de publicá-los.
- Sem Docker e sem dependências npm instaladas no ambiente de geração, os testes completos devem
  ser executados localmente com os comandos do README.
