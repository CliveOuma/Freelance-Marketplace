import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class JobsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findManyOpen(skip: number, take: number) {
    return this.prisma['job'].findMany({
      where: { status: 'OPEN' },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async countOpen() {
    return this.prisma['job'].count({
      where: { status: 'OPEN' },
    });
  }

  async findById(jobId: string) {
    return this.prisma['job'].findUnique({
      where: { id: jobId },
    });
  }

  async findManyByEmployerId(employerId: string, skip: number, take: number) {
    return this.prisma['job'].findMany({
      where: { employerId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async countByEmployerId(employerId: string) {
    return this.prisma['job'].count({
      where: { employerId },
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
    return this.prisma['job'].create({
      data,
    });
  }
}
