import { Module } from '@nestjs/common';
import { BidsService } from './services/bids.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JobsModule } from '../jobs/jobs.module';
import { BidsRepository } from './repositories/bids.repository';
import { WriterBidsController } from './controllers/bids.controller';

@Module({
  imports: [JobsModule],
  providers: [BidsService, BidsRepository, PrismaService],
  exports: [BidsService],
  controllers: [WriterBidsController],
})
export class BidsModule {}