import { Module } from '@nestjs/common';
import { JobsController } from './controllers/jobs.controller';
import { JobsService } from './services/jobs.service';
import { JobsRepository } from './repositories/jobs.repository';
import { BidsService } from '../bids/services/bids.service';
import { BidsController } from '../bids/controllers/bids.controller';
import { BidsRepository } from '../bids/repositories/bids.repository';

@Module({
  controllers: [JobsController, BidsController],
  providers: [JobsService, BidsService, JobsRepository, BidsRepository],
  exports: [JobsService, BidsService, JobsRepository, BidsRepository],
})
export class JobsModule {}
