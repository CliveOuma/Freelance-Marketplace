import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletTransactionType } from '@prisma/client';

@Injectable()
export class WalletsRepository {
  constructor(private readonly prisma: PrismaService) { }


  async findByUserId(userId: string) {
    return this.prisma.wallet.findUnique({
      where: { userId },
    });
  }

  async getOrCreate(userId: string) {
    return this.prisma.wallet.upsert({
      where: { userId },
      update: {}, //to get existing or create new
      create: {
        userId,
        balance: 0,
      },
    });
  }

  //Calculate wallet balance from transactions
  async calculateBalance(walletId: string): Promise<number> {
    const [credits, debits] = await Promise.all([
      this.prisma.walletTransaction.aggregate({
        where: {
          walletId,
          type: WalletTransactionType.credit,
        },
        _sum: { amount: true },
      }),
      this.prisma.walletTransaction.aggregate({
        where: {
          walletId,
          type: WalletTransactionType.debit,
        },
        _sum: { amount: true },
      }),
    ]);

    return (credits._sum.amount ?? 0) - (debits._sum.amount ?? 0);
  }


  async getTransactions(
    walletId: string,
    skip: number,
    take: number,
  ) {
    return this.prisma.walletTransaction.findMany({
      where: { walletId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async deposit(walletId: string, amount: number, description?: string) {
    return this.createTransaction({
      walletId,
      type: WalletTransactionType.credit,
      amount,
      description,
    });
  }

  async countTransactions(walletId: string) {
    return this.prisma.walletTransaction.count({
      where: { walletId },
    });
  }


  async createTransaction(data: {
    walletId: string;
    type: WalletTransactionType;
    amount: number;
    description?: string;
  }) {
    return this.prisma.walletTransaction.create({
      data,
    });
  }
}