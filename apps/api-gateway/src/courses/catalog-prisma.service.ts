import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../../generated/catalog/client';

@Injectable()
export class CatalogPrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    const url = process.env.CATALOG_DATABASE_URL;
    if (!url) throw new Error('Defina CATALOG_DATABASE_URL no arquivo .env');
    super({ adapter: new PrismaPg({ connectionString: url }) });
  }
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
