import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { WriterDashboardRepository } from './repositories/writer-dashboard.repository';
import { WalletRepository } from './repositories/wallet.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, WriterDashboardRepository, WalletRepository],
  exports: [UsersService],
})
export class UsersModule {}
