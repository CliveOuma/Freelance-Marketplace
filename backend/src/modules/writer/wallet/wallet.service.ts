import { Injectable } from '@nestjs/common';
import { WalletRepository } from '../repositories/wallet.repository';
import { getPaginationParams } from '../../common/constants/pagination';

@Injectable()
export class WalletService {
  constructor(private repo: WalletRepository) {}

  async getWalletWithTransactions(userId: string, page: number = 1) {
    const wallet = await this.repo.getOrCreateWallet(userId);
    const { take, skip } = getPaginationParams(page);
    const [transactions, total, balance] = await Promise.all([
      this.repo.getTransactionsPaginated(wallet.id, skip, take),
      this.repo.countTransactions(wallet.id),
      this.repo.getBalanceFromTransactions(wallet.id),
    ]);

    const roundedBalance = Math.round(balance * 100) / 100;
    return {
      balance: roundedBalance,
      transactions: transactions.map((t) => ({
        id: t.id,
        amount: t.amount,
        type: t.type,
        description: t.description ?? undefined,
        created_at: t.createdAt,
      })),
      meta: {
        page,
        total,
        totalPages: total === 0 ? 1 : Math.ceil(total / take),
      },
    };
  }
}
