import { Injectable, NotFoundException } from '@nestjs/common';
import { CatalogPrismaService } from './catalog-prisma.service';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: CatalogPrismaService) {}

  async findAll() {
    return this.prisma.course.findMany({
      include: {
        category: true,
        lessons: { orderBy: { position: 'asc' } },
      },
      orderBy: { title: 'asc' },
    });
  }

  async findOne(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        category: true,
        lessons: { orderBy: { position: 'asc' } },
      },
    });
    if (!course) throw new NotFoundException('Curso não encontrado');
    return course;
  }
}
