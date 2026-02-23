import { Module } from '@nestjs/common';
import { WriterDashboardController } from './writer-dashboard/writer-dashboard.controller';
import { WriterDashboardService } from './writer-dashboard/writer-dashboard.service';
import { WalletController } from './wallet/wallet.controller';
import { WalletService } from './wallet/wallet.service';
import { JobsController } from '../jobs/jobs.controller';
import { BidsController } from './bids/bids.controller';
import { BidsService } from './bids/bids.service';
import { SubmissionsController } from '../submissions/submissions.controller';
import { SubmissionsService } from '../submissions/submissions.service';
import { WriterDashboardRepository } from './repositories/writer-dashboard.repository';
import { WalletRepository } from './repositories/wallet.repository';
import { JobsRepository } from './repositories/jobs.repository';
import { BidsRepository } from './repositories/bids.repository';
import { SubmissionsRepository } from './repositories/submissions.repository';
import { JobsService } from '../jobs/jobs.service';


@Module({
  controllers: [
    WriterDashboardController,
    WalletController,
    JobsController,
    BidsController,
    SubmissionsController,
  ],
  providers: [
    WriterDashboardService,
    WriterDashboardRepository,
    WalletService,
    WalletRepository,
    JobsService,
    JobsRepository,
    BidsService,
    BidsRepository,
    SubmissionsService,
    SubmissionsRepository,
  ],
})
export class WriterModule {}
