import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class BidsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Find a single bid by id */
  async findById(bidId: string) {
    return this.prisma['bid'].findUnique({
      where: { id: bidId },
      include: { job: { select: { id: true, title: true, status: true } } },
    });
  }

  /** Find a single bid by composite unique (jobId + userId). */
  async findBidByJobAndUser(jobId: string, userId: string) {
    return this.prisma['bid'].findUnique({
      where: { jobId_userId: { jobId, userId } },
    });
  }

  /** Create a new bid for a job (idempotency handled at API layer if needed by checking if a bid already exists) */
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

  /** List bids by writer with pagination; includes minimal job info. */
  async findManyByUserId(userId: string, skip: number, take: number) {
    return this.prisma['bid'].findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { job: { select: { id: true, title: true, status: true } } },
      skip,
      take,
    });
  }

  /** Total count of bids for a writer (for pagination). */
  async countByUserId(userId: string) {
    return this.prisma['bid'].count({
      where: { userId },
    });
  }

  /** Delete a bid by id (writer can only delete own bid; check userId in service). */
  async deleteById(bidId: string) {
    return this.prisma['bid'].delete({
      where: { id: bidId },
    });
  }
}
