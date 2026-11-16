// Cria o banco adicional sem reinicializar o volume do PostgreSQL.
// Uso: node scripts/ensure-catalog-db.cjs
require('dotenv/config');
const { Client } = require('pg');

async function main() {
  const url = process.env.CATALOG_DATABASE_URL;
  if (!url) throw new Error('Defina CATALOG_DATABASE_URL no .env');
  const parsed = new URL(url);
  if (parsed.pathname.replace(/^\//, '') !== 'catalog_db') {
    throw new Error('Script limitado ao banco catalog_db do laboratório');
  }
  const adminUrl = new URL(url);
  adminUrl.pathname = '/postgres';
  adminUrl.search = '';
  const client = new Client({ connectionString: adminUrl.toString() });
  await client.connect();
  try {
    const result = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1', ['catalog_db'],
    );
    if (result.rowCount) console.log('catalog_db já existe');
    else {
      await client.query('CREATE DATABASE catalog_db');
      console.log('catalog_db criado');
    }
  } finally { await client.end(); }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
