import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BidsRepository } from '../repositories/bids.repository';
import { JobsRepository } from '../../jobs/repositories/jobs.repository';
import { CreateBidDto } from '../dto/create-bid.dto';
import { getPaginationParams } from '../../../common/constants/pagination';
import { DAILY_BID_LIMIT } from '../../../common/constants/pagination';

@Injectable()
export class BidsService {
  constructor(
    private readonly bidsRepo: BidsRepository,
    private readonly jobsRepo: JobsRepository,
    private readonly prisma: PrismaService,
  ) {}

  /** Place a bid on a job */
  async placeBid(userId: string, dto: CreateBidDto) {
    // Check if writer has active job
    const activeJob = await this.prisma.job.findFirst({
      where: {
        assignedWriterId: userId,
        status: { not: 'COMPLETED' },
      },
      select: { id: true },
    });
    if (activeJob)
      throw new BadRequestException(
        'You already have an assigned job. Complete it before bidding on another.',
      );
  
    // Check job existence & status
    const job = await this.jobsRepo.findById(dto.job_id);
    if (!job) throw new NotFoundException('Job not found');
    if (job.status !== 'OPEN')
      throw new BadRequestException('Job is not open for bidding');
  
    // Check if writer already bid on this job
    const existing = await this.bidsRepo.findBidByJobAndUser(dto.job_id, userId);
    if (existing)
      throw new BadRequestException('You have already placed a bid on this job');
  
    // Enforce daily bid limit
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const bidsToday = await this.prisma.bid.count({
      where: { userId, createdAt: { gte: startOfDay } },
    });
    if (bidsToday >= DAILY_BID_LIMIT)
      throw new BadRequestException(
        `Daily bid limit (${DAILY_BID_LIMIT}) reached. Try again tomorrow.`,
      );
  
    // Create bid with optional message and bid amount
    const bid = await this.bidsRepo.create({
      userId,
      jobId: dto.job_id,
    });
  
    return {
      message: 'Bid placed successfully',
      id: bid.id,
      job_id: bid.jobId,
      status: bid.status,
    };
  }
  /** List all bids by writer */
  async listBids(userId: string, page: number = 1) {
    const { take, skip } = getPaginationParams(page);
    const [bids, total] = await Promise.all([
      this.bidsRepo.findManyByUserId(userId, skip, take),
      this.bidsRepo.countByUserId(userId),
    ]);

    return {
      data: bids.map((b) => ({
        id: b.id,
        job_id: b.jobId,
        job_title: (b.job as any)?.title ?? null,
        job_status: (b.job as any)?.status ?? null,
        status: b.status,
        created_at: b.createdAt,
      })),
      meta: {
        page,
        total,
        totalPages: total === 0 ? 1 : Math.ceil(total / take),
      },
    };
  }

  /** Get bid by id */
  async getBidById(userId: string, bidId: string) {
    const bid = await this.bidsRepo.findById(bidId);
    if (!bid) throw new NotFoundException('Bid not found');
    if (bid.userId !== userId)
      throw new ForbiddenException('You can only view your own bids');

    return {
      id: bid.id,
      job_id: bid.jobId,
      job_title: (bid.job as any)?.title ?? null,
      job_status: (bid.job as any)?.status ?? null,
      status: bid.status,
      created_at: bid.createdAt,
    };
  }

  /** Delete bid */
  async deleteBid(userId: string, bidId: string) {
    const bid = await this.bidsRepo.findById(bidId);
    if (!bid) throw new NotFoundException('Bid not found');
    if (bid.userId !== userId)
      throw new ForbiddenException('You can only delete your own bids');

    await this.bidsRepo.deleteById(bidId);
    return { message: 'Bid deleted successfully' };
  }
}