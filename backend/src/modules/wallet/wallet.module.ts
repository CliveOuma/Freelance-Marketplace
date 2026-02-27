import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { WalletController } from './controllers/wallet.controller';
import { WalletService } from './services/wallet.service';
import { WalletsRepository } from './repositories/wallet.repository';

@Module({
  imports: [PrismaModule],
  controllers: [WalletController],
  providers: [WalletService, WalletsRepository],
  exports: [WalletService],
})
export class WalletModule {}
