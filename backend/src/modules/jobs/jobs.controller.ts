import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Controller('jobs')
@UseGuards(JwtAuthGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  //list open jobs for bidding
  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.WRITER)
  listOpenJobs(@Query() query: PaginationQueryDto) {
    return this.jobsService.listOpenJobs(query.page ?? 1);
  }

  //list my jobs
  @Get('my')
  @UseGuards(RolesGuard)
  @Roles(Role.EMPLOYER)
  listMyJobs(
    @Req() req: { user: { id: string } },
    @Query() query: PaginationQueryDto,
  ) {
    return this.jobsService.listMyJobs(req.user.id, query.page ?? 1);
  }

  //create job
  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.EMPLOYER)
  createJob(@Req() req: { user: { id: string } }, @Body() dto: CreateJobDto) {
    return this.jobsService.createJob(req.user.id, dto);
  }

  /** Single job by id. */
  @Get(':jobId')
  getJobById(@Param('jobId') jobId: string) {
    return this.jobsService.getJobById(jobId);
  }
}
