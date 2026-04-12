import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL?.replace('file:', '') || './dev.db' });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    const admin = await this.user.findFirst();
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      await this.user.create({
        data: { email: 'admin@admin.com', password: hashedPassword, name: 'Admin User' }
      });
      await this.category.create({
        data: { name: 'Technology' }
      });
    }
  }
}
