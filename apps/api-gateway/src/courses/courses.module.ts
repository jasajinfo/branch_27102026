import { Module } from '@nestjs/common';
import { CatalogPrismaService } from './catalog-prisma.service';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService, CatalogPrismaService],
})
export class CoursesModule {}
