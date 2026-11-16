/** Execute apenas após subir os três serviços e aplicar as migrações. */
import assert from 'node:assert/strict';
const base = `http://localhost:${process.env.GATEWAY_PORT || 3000}`;
const idSuffix = Date.now().toString(36);
async function request(path, method = 'GET', data, expectedStatus = 200) {
  const response = await fetch(base + path, {
    method, headers: data ? { 'Content-Type': 'application/json' } : {},
    body: data ? JSON.stringify(data) : undefined,
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  assert.equal(response.status, expectedStatus, `${method} ${path}: ${text}`);
  return body;
}
const health = await request('/health');
assert.equal(health.status, 'ok');
const user = await request('/users', 'POST', { name: 'Teste tutorial', email: `tutorial-${idSuffix}@email.com` }, 201);
assert.ok(user.id > 0);
const created = await request('/orders', 'POST', { userId: user.id, description: 'Notebook', total: 4500 }, 201);
assert.equal(created.userId, user.id);
const orders = await request(`/orders/user/${user.id}`);
assert.equal(orders.length, 1);
const updated = await request(`/users/${user.id}`, 'PATCH', { name: 'Teste atualizado' });
assert.equal(updated.name, 'Teste atualizado');
const orderUpdated = await request(`/orders/${created.id}`, 'PATCH', { description: 'Notebook atualizado' });
assert.equal(orderUpdated.description, 'Notebook atualizado');
await request(`/users/${user.id}`, 'DELETE', undefined, 409);
await request(`/orders/${created.id}`, 'DELETE');
await request(`/users/${user.id}`, 'DELETE');
await request('/orders', 'POST', { userId: user.id, description: 'Não permitido', total: 5 }, 400);
await request('/users', 'POST', { name: 'X', email: 'inválido' }, 400);
console.log('OK: Gateway, Users, Orders, CRUD, RPC, validação, exclusão protegida e Prisma.');
