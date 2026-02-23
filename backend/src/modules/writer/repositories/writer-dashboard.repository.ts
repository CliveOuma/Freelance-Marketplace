import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

/** WalletTransactionType.credit for aggregate filter (avoids @prisma/client enum export). */
const WALLET_CREDIT = 'credit' as const;

//Writer dashboard repository: aggregated stats (bids today, pending submissions, earnings).
@Injectable()
export class WriterDashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  //Sum of credit transactions for the writer's wallet (earnings)
  async getWalletBalanceByUserId(userId: string): Promise<number> {
    const result = await this.prisma['walletTransaction'].aggregate({
      where: {
        wallet: { userId },
        type: WALLET_CREDIT,
      },
      _sum: { amount: true },
    });
    return result._sum.amount ?? 0;
  }

  /** Count bids placed today by the writer (for available_bids = daily limit - count). */
  async getBidsPlacedTodayCount(userId: string): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    return this.prisma['bid'].count({
      where: {
        userId,
        createdAt: { gte: startOfDay },
      },
    });
  }

  /** Count submissions with status PENDING for the writer. */
  async getPendingSubmissionsCount(userId: string): Promise<number> {
    return this.prisma['submission'].count({
      where: { writerId: userId, status: 'PENDING' } as any,
    });
  }

  /** Whether the writer has any credit (earnings). */
  async hasEarnings(userId: string): Promise<boolean> {
    const sum = await this.getWalletBalanceByUserId(userId);
    return sum > 0;
  }

  /** Whether the writer has any active (PENDING or ACCEPTED) bids. */
  async hasActiveBids(userId: string): Promise<boolean> {
    const count = await this.prisma['bid'].count({
      where: {
        userId,
        status: { in: ['PENDING', 'ACCEPTED'] },
      },
    });
    return count > 0;
  }
}
