-- Aplicado automaticamente apenas na primeira inicialização do volume do PostgreSQL.
CREATE DATABASE users_db;
CREATE DATABASE orders_db;

SELECT 'CREATE DATABASE notifications_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'notifications_db')\gexec

-- O catálogo é adicionado sem alterar os bancos do Tutorial 03.
SELECT 'CREATE DATABASE catalog_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'catalog_db')\gexec
