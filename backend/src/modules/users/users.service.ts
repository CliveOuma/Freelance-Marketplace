import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WriterDashboardRepository } from './repositories/writer-dashboard.repository';
import { WalletRepository } from './repositories/wallet.repository';
import { getPaginationParams } from '../common/constants/pagination';
import { DAILY_BID_LIMIT } from '../common/constants/pagination';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dashboardRepo: WriterDashboardRepository,
    private readonly walletRepo: WalletRepository,
  ) {}

  /** Admin: list all users (paginated). */
  async findAll(page: number = 1) {
    const { take, skip } = getPaginationParams(page);
    const [users, total] = await Promise.all([
      this.prisma['user'].findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          phoneNumber: true,
          rating: true,
          createdAt: true,
        },
      }),
      this.prisma['user'].count(),
    ]);
    return {
      data: users,
      meta: {
        page,
        total,
        totalPages: total === 0 ? 1 : Math.ceil(total / take),
      },
    };
  }

  async findOne(id: string, currentUserId: string, currentRole: string) {
    if (currentRole !== Role.ADMIN && currentUserId !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }
    const user = await this.prisma['user'].findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        phoneNumber: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(
    id: string,
    currentUserId: string,
    currentRole: string,
    data: { firstName?: string; lastName?: string; phoneNumber?: string | null },
  ) {
    if (currentRole !== Role.ADMIN && currentUserId !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    const user = await this.prisma['user'].findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const updated = await this.prisma['user'].update({
      where: { id },
      data: {
        ...(data.firstName !== undefined && { firstName: data.firstName }),
        ...(data.lastName !== undefined && { lastName: data.lastName }),
        ...(data.phoneNumber !== undefined && {
          phoneNumber: data.phoneNumber || null,
        }),
      },
    });
    const { password: _, ...rest } = updated;
    return rest;
  }

  /** Admin only: delete user. */
  async remove(id: string) {
    const user = await this.prisma['user'].findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.prisma['user'].delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }

  /** Writer: dashboard summary. */
  async getDashboard(userId: string) {
    const [wallet_balance, bidsToday, pending_submissions, hasEarnings, hasActiveBids] =
      await Promise.all([
        this.dashboardRepo.getWalletBalanceByUserId(userId),
        this.dashboardRepo.getBidsPlacedTodayCount(userId),
        this.dashboardRepo.getPendingSubmissionsCount(userId),
        this.dashboardRepo.hasEarnings(userId),
        this.dashboardRepo.hasActiveBids(userId),
      ]);
    const available_bids = Math.max(0, DAILY_BID_LIMIT - bidsToday);
    const status =
      hasEarnings || hasActiveBids ? ('active' as const) : ('dormant' as const);
    return {
      wallet_balance: Math.round(wallet_balance * 100) / 100,
      available_bids,
      pending_submissions,
      status,
    };
  }

  /** Writer: wallet with transactions. */
  async getWallet(userId: string, page: number = 1) {
    const wallet = await this.walletRepo.getOrCreateWallet(userId);
    const { take, skip } = getPaginationParams(page);
    const [transactions, total, balance] = await Promise.all([
      this.walletRepo.getTransactionsPaginated(wallet.id, skip, take),
      this.walletRepo.countTransactions(wallet.id),
      this.walletRepo.getBalanceFromTransactions(wallet.id),
    ]);
    return {
      balance: Math.round(balance * 100) / 100,
      transactions: transactions.map((t) => ({
        id: t.id,
        amount: t.amount,
        type: t.type,
        description: (t as { description?: string | null }).description ?? undefined,
        created_at: (t as { createdAt: Date }).createdAt,
      })),
      meta: {
        page,
        total,
        totalPages: total === 0 ? 1 : Math.ceil(total / take),
      },
    };
  }
}
