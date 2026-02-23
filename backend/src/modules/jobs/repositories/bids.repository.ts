import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BidsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(bidId: string) {
    return this.prisma['bid'].findUnique({
      where: { id: bidId },
      include: { job: { select: { id: true, title: true, status: true } } },
    });
  }

  async findBidByJobAndUser(jobId: string, userId: string) {
    return this.prisma['bid'].findUnique({
      where: { jobId_userId: { jobId, userId } },
    });
  }

  async create(data: {
    userId: string;
    jobId: string;
    bidAmount: number;
    message: string;
  }) {
    return this.prisma['bid'].create({
      data: {
        userId: data.userId,
        jobId: data.jobId,
        bidAmount: data.bidAmount,
        message: data.message,
      },
    });
  }

  async findManyByUserId(userId: string, skip: number, take: number) {
    return this.prisma['bid'].findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { job: { select: { id: true, title: true, status: true } } },
      skip,
      take,
    });
  }

  async countByUserId(userId: string) {
    return this.prisma['bid'].count({
      where: { userId },
    });
  }

  async deleteById(bidId: string) {
    return this.prisma['bid'].delete({
      where: { id: bidId },
    });
  }

  async countBidsPlacedTodayByUser(userId: string): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    return this.prisma['bid'].count({
      where: { userId, createdAt: { gte: startOfDay } },
    });
  }
}
