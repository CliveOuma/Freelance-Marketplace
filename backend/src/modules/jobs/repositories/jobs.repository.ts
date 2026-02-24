import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { JobStatus } from '@prisma/client';

@Injectable()
export class JobsRepository {
  constructor(private readonly prisma: PrismaService) { }


  async findMany(params: { status?: JobStatus; skip?: number; take?: number }) {
    return this.prisma.job.findMany({
      where: {
        ...(params.status && { status: params.status }),
      },
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(params: { status?: JobStatus }) {
    return this.prisma.job.count({
      where: {
        ...(params.status && { status: params.status }),
      },
    });
  }

  async findById(jobId: string) {
    return this.prisma.job.findUnique({
      where: { id: jobId },
    });
  }

  async findManyByEmployerId(
    employerId: string,
    skip: number,
    take: number,
    status?: JobStatus,
  ) {
    return this.prisma.job.findMany({
      where: {
        employerId,
        ...(status && { status }),
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async countByEmployerId(employerId: string, status?: JobStatus) {
    return this.prisma.job.count({
      where: {
        employerId,
        ...(status && { status }),
      },
    });
  }

  async create(data: {
    title: string;
    description: string;
    category: string;
    budget: number;
    deadline: Date;
    employerId: string;
  }) {
    return this.prisma.job.create({ data });
  }

  /** Get active job assigned to a writer */
  async getActiveJobForWriter(userId: string) {
    return this.prisma.job.findFirst({
      where: {
        assignedWriterId: userId,
        status: JobStatus.IN_PROGRESS,
      },
    });
  }

  /** Assign a job to a writer */
  async assignJob(jobId: string, writerId: string) {
    return this.prisma.job.update({
      where: { id: jobId },
      data: { assignedWriterId: writerId, status: JobStatus.IN_PROGRESS },
    });
  }
  /** Mark a job as completed */
  async completeJob(jobId: string) {
    return this.prisma.job.update({
      where: { id: jobId },
      data: { status: JobStatus.COMPLETED },
    });
  }
}