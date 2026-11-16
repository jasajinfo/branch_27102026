// Cria apenas notifications_db em um PostgreSQL já inicializado no Docker.
// Uso: node scripts/ensure-notifications-db.cjs (requer .env e PostgreSQL ativo).
require('dotenv/config');
const { Client } = require('pg');

async function main() {
  const url = process.env.NOTIFICATIONS_DATABASE_URL;
  if (!url) throw new Error('Defina NOTIFICATIONS_DATABASE_URL no .env');
  const parsed = new URL(url);
  if (parsed.pathname.slice(1) !== 'notifications_db') {
    throw new Error('Script limitado ao banco notifications_db do laboratório');
  }
  const adminUrl = new URL(url);
  adminUrl.pathname = '/postgres';
  adminUrl.search = '';
  const client = new Client({ connectionString: adminUrl.toString() });
  await client.connect();
  try {
    const result = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', ['notifications_db']);
    if (result.rowCount) console.log('notifications_db já existe');
    else {
      await client.query('CREATE DATABASE notifications_db');
      console.log('notifications_db criado');
    }
  } finally { await client.end(); }
}
main().catch((err) => { console.error(err); process.exitCode = 1; });
