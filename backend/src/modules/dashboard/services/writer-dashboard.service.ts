import { Injectable } from '@nestjs/common';
import { DAILY_BID_LIMIT } from '../../../common/constants/pagination';
import { WriterDashboardRepository } from '../repository/writer-dashboard.repository';

export interface DashboardSummary {
  wallet_balance: number;
  available_bids: number;
  pending_submissions: number;
  status: 'active' | 'dormant';
}

@Injectable()
export class WriterDashboardService {
  constructor(private repo: WriterDashboardRepository) {}

  
  //status: dormant = no earnings AND no active bids; active otherwise.
  async getSummary(userId: string): Promise<DashboardSummary> {
    const [wallet_balance, bidsToday, pending_submissions, hasEarnings] =
      await Promise.all([
        this.repo.getWalletBalanceByUserId(userId),
        this.repo.getBidsPlacedTodayCount(userId),
        this.repo.getPendingSubmissionsCount(userId),
        this.repo.hasEarnings(userId),
      ]);

    const available_bids = Math.max(0, DAILY_BID_LIMIT - bidsToday);
    const status: 'active' | 'dormant' =
      hasEarnings? 'active' : 'dormant';

    return {
      wallet_balance: Math.round(wallet_balance * 100) / 100,
      available_bids,
      pending_submissions,
      status,
    };
  }
}
