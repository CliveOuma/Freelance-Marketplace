import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { BidsController } from './bids.controller';
import { JobsService } from './jobs.service';
import { BidsService } from './bids.service';
import { JobsRepository } from './repositories/jobs.repository';
import { BidsRepository } from './repositories/bids.repository';

@Module({
  controllers: [JobsController, BidsController],
  providers: [JobsService, BidsService, JobsRepository, BidsRepository],
  exports: [JobsService, BidsService],
})
export class JobsModule {}
