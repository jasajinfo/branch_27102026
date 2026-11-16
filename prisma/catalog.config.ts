import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'catalog/schema.prisma',
  migrations: {
    path: 'catalog/migrations',
    // Usa o ts-node já presente no projeto base; não requer dependências novas.
    seed: 'node -r ts-node/register prisma/catalog/seed.ts',
  },
  datasource: { url: env('CATALOG_DATABASE_URL') },
});
