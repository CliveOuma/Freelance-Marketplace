import { Injectable, NotFoundException } from '@nestjs/common';
import { JobsRepository } from '../repositories/jobs.repository';
import { getPaginationParams } from 'src/common/constants/pagination';
import { CreateJobDto } from '../dto/create-job.dto';
import { JobStatus } from '@prisma/client';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class JobsService {
  constructor(private readonly repo: JobsRepository) { }


  async listJobs({
    userId,
    role,
    status,
    page = 1,
  }: {
    userId: string;
    role: Role;
    status?: JobStatus;
    page?: number;
  }) {
    const { take, skip } = getPaginationParams(page);


    if (role === Role.WRITER) {
      const filterStatus = status ?? JobStatus.OPEN;
      const [jobs, total] = await Promise.all([
        this.repo.findMany({ status: filterStatus, skip, take }),
        this.repo.count({ status: filterStatus }),
      ]);

      return {
        data: jobs.map(this.formatJob),
        meta: { page, total, totalPages: total === 0 ? 1 : Math.ceil(total / take) },
      };
    }


    if (role === Role.EMPLOYER) {
      const [jobs, total] = await Promise.all([
        this.repo.findManyByEmployerId(userId, skip, take, status),
        this.repo.countByEmployerId(userId, status),
      ]);

      return {
        data: jobs.map(this.formatJob),
        meta: { page, total, totalPages: total === 0 ? 1 : Math.ceil(total / take) },
      };
    }

    //Default empty response for any other roles
    return { data: [], meta: { page, total: 0, totalPages: 1 } };
  }


  async getJobById(jobId: string) {
    const job = await this.repo.findById(jobId);
    if (!job) throw new NotFoundException('Job not found');
    return this.formatJob(job);
  }


  async createJob(employerId: string, dto: CreateJobDto) {
    const job = await this.repo.create({
      title: dto.title,
      description: dto.description,
      category: dto.category,
      budget: dto.budget,
      deadline: new Date(dto.deadline),
      employerId,
    });
    return this.formatJob(job);
  }

  async assignJob(jobId: string, writerId: string) {
    const updated = await this.repo.assignJob(jobId, writerId);
    return this.formatJob(updated);
  }

  private formatJob(job: any) {
    return {
      id: job.id,
      title: job.title,
      description: job.description,
      category: job.category,
      budget: job.budget,
      deadline: job.deadline.toISOString().split('T')[0],
      status: job.status,
    };
  }
}