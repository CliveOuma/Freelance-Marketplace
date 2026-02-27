import { Module } from '@nestjs/common';
import { SubmissionsController } from './controllers/submissions.controller';
import { SubmissionsService } from './services/submissions.service';
import { SubmissionsRepository } from './repositories/submissions.repository';

@Module({
  controllers: [SubmissionsController],
  providers: [SubmissionsService, SubmissionsRepository],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
