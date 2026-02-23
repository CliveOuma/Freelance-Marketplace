import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

/** WalletTransactionType enum values (schema: credit | debit).*/
const WalletTransactionType = { credit: 'credit' as const, debit: 'debit' as const };

/**
 * Writer wallet repository: balance and transactions (NestJS:
 * Uses bracket access (prisma['wallet']) so TS works regardless of PrismaClient type resolution.
 */
@Injectable()
export class WalletRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findWalletByUserId(userId: string) {
    return this.prisma['wallet'].findUnique({
      where: { userId },
    });
  }

  /** Get or create wallet for user (used when writer first accesses wallet). */
  async getOrCreateWallet(userId: string) {
    let wallet = await this.prisma['wallet'].findUnique({
      where: { userId },
    });
    if (!wallet) {
      wallet = await this.prisma['wallet'].create({
        data: { userId, balance: 0 },
      });
    }
    return wallet;
  }

  /** Balance = sum(credits) - sum(debits) for a wallet. */
  async getBalanceFromTransactions(walletId: string): Promise<number> {
    const [credits, debits] = await Promise.all([
      this.prisma['walletTransaction'].aggregate({
        where: { walletId, type: WalletTransactionType.credit },
        _sum: { amount: true },
      }),
      this.prisma['walletTransaction'].aggregate({
        where: { walletId, type: WalletTransactionType.debit },
        _sum: { amount: true },
      }),
    ]);
    return (credits._sum.amount ?? 0) - (debits._sum.amount ?? 0);
  }

  async getTransactionsPaginated(
    walletId: string,
    skip: number,
    take: number,
  ) {
    return this.prisma['walletTransaction'].findMany({
      where: { walletId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async countTransactions(walletId: string) {
    return this.prisma['walletTransaction'].count({
      where: { walletId },
    });
  }
}
