import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { WriterDashboardController } from './controllers/writer-dashboard.controller';
import { WriterDashboardService } from './services/writer-dashboard.service';
import { WriterDashboardRepository } from './repository/writer-dashboard.repository';

@Module({
  imports: [PrismaModule],
  controllers: [WriterDashboardController],
  providers: [WriterDashboardService, WriterDashboardRepository],
  exports: [WriterDashboardService],
})
export class DashboardModule {}
