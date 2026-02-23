import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

//Writer submissions repository (NestJS: data access only, no business logic).
@Injectable()
export class SubmissionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(submissionId: string) {
    return this.prisma['submission'].findUnique({
      where: { id: submissionId },
      include: { job: { select: { id: true, title: true, status: true } } },
    });
  }

  async create(data: {
    writerId: string;
    jobId: string;
    filePath: string;
    notes?: string;
  }) {
    return this.prisma['submission'].create({
      data: {
        writerId: data.writerId,
        jobId: data.jobId,
        filePath: data.filePath,
        notes: data.notes ?? null,
      },
    });
  }

  async findManyByWriterId(writerId: string, skip: number, take: number) {
    return this.prisma['submission'].findMany({
      where: { writerId },
      orderBy: { createdAt: 'desc' },
      include: { job: { select: { id: true, title: true, status: true } } },
      skip,
      take,
    });
  }

  async countByWriterId(writerId: string) {
    return this.prisma['submission'].count({
      where: { writerId },
    });
  }
}
