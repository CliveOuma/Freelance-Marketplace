import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class SubmissionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(submissionId: string) {
    return this.prisma.submission.findUnique({
      where: { id: submissionId },
      include: { job: { select: { id: true, title: true, status: true } } },
    });
  }
  //Creates a new submission record.
  async create(data: {
    writerId: string;
    jobId: string;
    filePath: string;
    notes?: string;
  }) {
    return this.prisma.submission.create({
      data: {
        writerId: data.writerId,
        jobId: data.jobId,
        filePath: data.filePath,
        notes: data.notes ?? null,
      },
    });
  }
  //Fetches multiple submissions for a specific writer.
  async findManyByWriterId(writerId: string, skip: number, take: number) {
    return this.prisma.submission.findMany({
      where: { writerId },
      orderBy: { createdAt: 'desc' },
      include: { job: { select: { id: true, title: true, status: true } } },
      skip,
      take,
    });
  }
  //Counts total submissions for a writer Useful for dashboard statistics.
  async countByWriterId(writerId: string) {
    return this.prisma.submission.count({
      where: { writerId },
    });
  }
}