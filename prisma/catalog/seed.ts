import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/catalog/client';

const connectionString = process.env.CATALOG_DATABASE_URL;
if (!connectionString) throw new Error('CATALOG_DATABASE_URL não configurada no .env');

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main(): Promise<void> {
  console.log('Iniciando seed do catálogo DevFlix...');

  const frontend = await prisma.category.upsert({
    where: { slug: 'frontend' },
    update: { name: 'Desenvolvimento Frontend' },
    create: { slug: 'frontend', name: 'Desenvolvimento Frontend' },
  });
  const backend = await prisma.category.upsert({
    where: { slug: 'backend' },
    update: { name: 'Desenvolvimento Backend' },
    create: { slug: 'backend', name: 'Desenvolvimento Backend' },
  });
  const database = await prisma.category.upsert({
    where: { slug: 'banco-de-dados' },
    update: { name: 'Banco de Dados' },
    create: { slug: 'banco-de-dados', name: 'Banco de Dados' },
  });

  const react = await prisma.course.upsert({
    where: { slug: 'react-iniciantes' },
    update: {
      title: 'React para Iniciantes', description: 'Fundamentos do React.',
      categoryId: frontend.id, published: true,
    },
    create: {
      slug: 'react-iniciantes', title: 'React para Iniciantes',
      description: 'Fundamentos do React.', categoryId: frontend.id,
      published: true,
    },
  });
  const node = await prisma.course.upsert({
    where: { slug: 'nodejs-iniciantes' },
    update: {
      title: 'Node.js para Iniciantes', description: 'Introdução ao Node.js.',
      categoryId: backend.id, published: true,
    },
    create: {
      slug: 'nodejs-iniciantes', title: 'Node.js para Iniciantes',
      description: 'Introdução ao Node.js.', categoryId: backend.id,
      published: true,
    },
  });
  const sql = await prisma.course.upsert({
    where: { slug: 'sql-fundamentos' },
    update: {
      title: 'Fundamentos de SQL', description: 'Introdução aos bancos relacionais.',
      categoryId: database.id, published: true,
    },
    create: {
      slug: 'sql-fundamentos', title: 'Fundamentos de SQL',
      description: 'Introdução aos bancos relacionais.', categoryId: database.id,
      published: true,
    },
  });

  const lessons = [
    {
      courseId: react.id, title: 'Introdução ao React',
      description: 'Primeiros conceitos de React.',
      videoId: 'Tn6-PIqc4UM', position: 1,
    },
    {
      courseId: react.id, title: 'Componentes e JSX',
      description: 'Organizando interfaces em componentes.',
      videoId: 'w7ejDZ8SWv8', position: 2,
    },
    {
      courseId: node.id, title: 'Introdução ao Node.js',
      description: 'Conhecendo o ambiente Node.js.',
      videoId: 'TlB_eWDSMt4', position: 1,
    },
    {
      courseId: sql.id, title: 'Introdução aos Bancos de Dados',
      description: 'Conceitos básicos de SQL.',
      videoId: 'HXV3zeQKqGY', position: 1,
    },
  ];

  for (const lesson of lessons) {
    const { courseId, position, ...data } = lesson;
    await prisma.lesson.upsert({
      where: { courseId_position: { courseId, position } },
      update: data,
      create: { ...data, courseId, position },
    });
  }

  console.log('Seed do catálogo finalizado com sucesso!');
}

main()
  .catch((error: unknown) => {
    console.error('Erro ao executar o seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => { await prisma.$disconnect(); });
