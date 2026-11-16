// Teste HTTP não destrutivo: requer catálogo populado e Gateway iniciado.
import assert from 'node:assert/strict';
const base = `http://localhost:${process.env.GATEWAY_PORT || 3000}`;
async function request(path, status) {
  const result = await fetch(base + path);
  const body = await result.json();
  assert.equal(result.status, status, `${path}: ${JSON.stringify(body)}`);
  return body;
}
const courses = await request('/courses', 200);
assert.ok(Array.isArray(courses) && courses.length >= 3, 'Execute o seed antes do teste');
for (const course of courses) {
  assert.ok(course.category && typeof course.category.name === 'string');
  assert.ok(Array.isArray(course.lessons));
  for (let i = 1; i < course.lessons.length; i++) {
    assert.ok(course.lessons[i - 1].position <= course.lessons[i].position);
  }
}
const one = await request(`/courses/${courses[0].id}`, 200);
assert.equal(one.id, courses[0].id);
const notFound = await request('/courses/999999999', 404);
assert.equal(notFound.message, 'Curso não encontrado');
await request('/courses/abc', 400);
console.log('OK: GET /courses, GET /courses/:id, categorias, aulas, 404 e 400');
