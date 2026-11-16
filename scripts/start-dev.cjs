// Atalho: npm run start:dev -- users|orders|notifications|api-gateway
const { spawn } = require('node:child_process');
const name = process.argv[2];
if (!['users', 'orders', 'notifications', 'api-gateway'].includes(name)) {
  console.error('Uso: npm run start:dev -- users|orders|notifications|api-gateway');
  process.exit(1);
}
// ts-node (compilador TypeScript) preserva emitDecoratorMetadata exigido pelo NestJS.
const child = spawn(process.execPath,
  ['--watch', '-r', 'ts-node/register', '-r', 'tsconfig-paths/register', `apps/${name}/src/main.ts`],
  { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 1));
