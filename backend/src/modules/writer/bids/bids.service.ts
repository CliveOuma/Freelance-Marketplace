import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { BidsRepository } from '../repositories/bids.repository';
import { JobsRepository } from '../repositories/jobs.repository';
import { WriterDashboardRepository } from '../repositories/writer-dashboard.repository';
import { CreateBidDto } from './dto/create-bid.dto';
import { getPaginationParams } from '../../common/constants/pagination';
import { DAILY_BID_LIMIT } from '../../common/constants/pagination';

@Injectable()
export class BidsService {
  constructor(
    private bidsRepo: BidsRepository,
    private jobsRepo: JobsRepository,
    private dashboardRepo: WriterDashboardRepository,
  ) {}

  async placeBid(userId: string, dto: CreateBidDto) {
    const job = await this.jobsRepo.findById(dto.job_id);
    if (!job) throw new NotFoundException('Job not found');
    if (String(job.status) !== 'OPEN')
      throw new BadRequestException('Job is not open for bidding');

    const existing = await this.bidsRepo.findBidByJobAndUser(dto.job_id, userId);
    if (existing)
      throw new BadRequestException('You have already placed a bid on this job');

    const bidsToday = await this.dashboardRepo.getBidsPlacedTodayCount(userId);
    if (bidsToday >= DAILY_BID_LIMIT)
      throw new BadRequestException(
        `Daily bid limit (${DAILY_BID_LIMIT}) reached. Try again tomorrow.`,
      );

    const bid = await this.bidsRepo.create({
      userId,
      jobId: dto.job_id,
      bidAmount: dto.bid_amount,
      message: dto.message,
    });

    return {
      message: 'Bid placed successfully',
      id: bid.id,
      job_id: bid.jobId,
      bid_amount: bid.bidAmount,
      status: bid.status,
    };
  }

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
        job_title: (b.job as { title: string }).title,
        job_status: (b.job as { status: string }).status,
        bid_amount: b.bidAmount,
        message: b.message,
        status: (b as { status: string }).status,
        created_at: b.createdAt,
      })),
      meta: {
        page,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async getBidById(userId: string, bidId: string) {
    const bid = await this.bidsRepo.findById(bidId);
    if (!bid) throw new NotFoundException('Bid not found');
    if (bid.userId !== userId)
      throw new ForbiddenException('You can only view your own bids');
    return {
      id: bid.id,
      job_id: bid.jobId,
      job_title: (bid.job as { title: string }).title,
      job_status: (bid.job as { status: string }).status,
      bid_amount: bid.bidAmount,
      message: bid.message,
      status: (bid as { status: string }).status,
      created_at: bid.createdAt,
    };
  }

  async deleteBid(userId: string, bidId: string) {
    const bid = await this.bidsRepo.findById(bidId);
    if (!bid) throw new NotFoundException('Bid not found');
    if (bid.userId !== userId)
      throw new ForbiddenException('You can only delete your own bids');
    await this.bidsRepo.deleteById(bidId);
    return { message: 'Bid deleted successfully' };
  }
}
