import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import { NotFoundException } from '@nestjs/common';
import { CoursesService } from './courses.service';
import type { CatalogPrismaService } from './catalog-prisma.service';

describe('CoursesService - Tutorial 04', () => {
  it('deve listar cursos com categoria e aulas ordenadas', async () => {
    const rows = [{ id: 1, title: 'React para Iniciantes', category: { id: 1 }, lessons: [] }];
    const findMany = mock.fn(async (_query: unknown) => rows);
    const prisma = { course: { findMany } } as unknown as CatalogPrismaService;
    const service = new CoursesService(prisma);
    assert.deepEqual(await service.findAll(), rows);
    assert.equal(findMany.mock.callCount(), 1);
    assert.deepEqual(findMany.mock.calls[0].arguments[0], {
      include: { category: true, lessons: { orderBy: { position: 'asc' } } },
      orderBy: { title: 'asc' },
    });
  });

  it('deve encontrar um curso pelo ID', async () => {
    const row = { id: 2, title: 'Node.js para Iniciantes', category: { id: 2 }, lessons: [] };
    const findUnique = mock.fn(async (_query: unknown) => row);
    const prisma = { course: { findUnique } } as unknown as CatalogPrismaService;
    const service = new CoursesService(prisma);
    assert.deepEqual(await service.findOne(2), row);
    assert.deepEqual((findUnique.mock.calls[0].arguments[0] as { where: unknown }).where, { id: 2 });
  });

  it('deve lançar HTTP 404 quando o curso não existe', async () => {
    const findUnique = mock.fn(async (_query: unknown) => null);
    const prisma = { course: { findUnique } } as unknown as CatalogPrismaService;
    const service = new CoursesService(prisma);
    await assert.rejects(service.findOne(999999), NotFoundException);
  });
});
