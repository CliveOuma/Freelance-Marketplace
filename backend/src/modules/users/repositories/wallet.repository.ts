import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

const WalletTransactionType = {
  credit: 'credit' as const,
  debit: 'debit' as const,
};

@Injectable()
export class WalletRepository {
  constructor(private readonly prisma: PrismaService) {}

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

  async getTransactionsPaginated(walletId: string, skip: number, take: number) {
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
