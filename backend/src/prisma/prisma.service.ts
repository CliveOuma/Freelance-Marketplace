import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * NestJS injectable database service. Extends PrismaClient so all generated
 * model delegates (user, bid, job, etc.) are available. Run `npx prisma generate`
 * after schema changes so types stay in sync.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected successfully');
    } catch (error) {
      
      this.logger.error('Database connection failed');
      this.logger.error(error);
      process.exit(1); // stop app if DB fails
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }
}
