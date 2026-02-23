import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

//Read-only for open jobs
@Injectable()
export class JobsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get db(): PrismaClient {
    return this.prisma as unknown as PrismaClient;
  }

  /** List open jobs with pagination (for writer job list). */
  async findManyOpen(skip: number, take: number) {
    return this.db.job.findMany({
      where: { status: 'OPEN' },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  /** Count of open jobs (for pagination metadata). */
  async countOpen() {
    return this.db.job.count({
      where: { status: 'OPEN' },
    });
  }

  /** Fetch a single job by id (e.g. before placing a bid). */
  async findById(jobId: string) {
    return this.db.job.findUnique({
      where: { id: jobId },
    });
  }
}
