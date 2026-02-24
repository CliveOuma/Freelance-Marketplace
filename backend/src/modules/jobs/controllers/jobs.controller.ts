import { Controller, Get, Post, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JobsService } from '../services/jobs.service';
import { CreateJobDto } from '../dto/create-job.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { JobStatus } from '@prisma/client';
import { BidsService } from '../../bids/services/bids.service';
import { CreateBidDto } from '../../bids/dto/create-bid.dto';

@Controller('jobs')
@UseGuards(JwtAuthGuard)
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly bidsService: BidsService,
  ) { }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.WRITER, Role.EMPLOYER)
  listJobs(
    @Req() req: { user: { id: string; role: Role } },
    @Query('status') status?: JobStatus,
    @Query() query?: PaginationQueryDto,
  ) {
    return this.jobsService.listJobs({
      userId: req.user.id,
      role: req.user.role,
      status,
      page: query?.page ?? 1,
    });
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.EMPLOYER)
  createJob(
    @Req() req: { user: { id: string } },
    @Body() dto: CreateJobDto,
  ) {
    return this.jobsService.createJob(req.user.id, dto);
  }


  @Get(':jobId')
  getJobById(@Param('jobId') jobId: string) {
    return this.jobsService.getJobById(jobId);
  }

  @Post(':jobId/bid')
  @UseGuards(RolesGuard)
  @Roles(Role.WRITER)
  placeBid(@Param('jobId') jobId: string, @Req() req) {
    const dto: CreateBidDto = { job_id: jobId };
    return this.bidsService.placeBid(req.user.id, dto);
  }

  // Assign a job to a writer (employer only)
  @Post(':jobId/assign')
  @UseGuards(RolesGuard)
  @Roles(Role.EMPLOYER)
  assignJob(
    @Param('jobId') jobId: string,
    @Body('writerId') writerId: string,
    @Req() req: { user: { id: string } },
  ) {
    // Optionally: verify req.user.id === job.employerId in service
    return this.jobsService.assignJob(jobId, writerId);
  }
}