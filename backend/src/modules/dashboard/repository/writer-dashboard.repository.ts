import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


const WALLET_CREDIT = 'credit' as const;


@Injectable()
export class WriterDashboardRepository {
    constructor(private readonly prisma: PrismaService) { }


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


    async getActiveJobForWriter(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                jobs: {
                    where: { status: 'IN_PROGRESS' },
                    take: 1,
                },
            },
        });

        return user?.jobs?.[0] || null;
    }



    async getPendingSubmissionsCount(userId: string): Promise<number> {
        return this.prisma['submission'].count({
            where: { writerId: userId, status: 'PENDING' } as any,
        });
    }


    async hasEarnings(userId: string): Promise<boolean> {
        const sum = await this.getWalletBalanceByUserId(userId);
        return sum > 0;
    }


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
