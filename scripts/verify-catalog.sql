-- Tutorial 04: consultas de verificação não destrutivas.
-- No PowerShell: Get-Content scripts/verify-catalog.sql | docker exec -i postgres-curso-ads psql -U postgres -d catalog_db

-- Lista cursos e suas categorias.
SELECT c.id, c.title, cat.name AS category
FROM "Course" c
INNER JOIN "Category" cat ON c."categoryId" = cat.id
ORDER BY c.title;

-- Mostra aulas e sua ordem dentro de cada curso.
SELECT l.title AS lesson, c.title AS course, l.position
FROM "Lesson" l
INNER JOIN "Course" c ON l."courseId" = c.id
ORDER BY c.title, l.position;

-- Inclui cursos ainda sem aulas.
SELECT c.title, COUNT(l.id) AS total_lessons
FROM "Course" c
LEFT JOIN "Lesson" l ON l."courseId" = c.id
GROUP BY c.id, c.title
ORDER BY c.title;

-- Inspeciona as foreign keys e suas regras de exclusão.
SELECT conname, confdeltype FROM pg_constraint
WHERE conname IN ('Course_categoryId_fkey', 'Lesson_courseId_fkey')
ORDER BY conname;
