import { Injectable, NotFoundException } from '@nestjs/common';
import { JobsRepository } from './repositories/jobs.repository';
import { getPaginationParams } from '../common/constants/pagination';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  constructor(private readonly repo: JobsRepository) {}

  async listOpenJobs(page: number = 1) {
    const { take, skip } = getPaginationParams(page);
    const [jobs, total] = await Promise.all([
      this.repo.findManyOpen(skip, take),
      this.repo.countOpen(),
    ]);
    return {
      data: jobs.map((j) => ({
        id: j.id,
        title: j.title,
        description: j.description,
        category: (j as { category: string }).category,
        budget: j.budget,
        deadline: j.deadline.toISOString().split('T')[0],
        status: (j as { status: string }).status,
      })),
      meta: {
        page,
        total,
        totalPages: total === 0 ? 1 : Math.ceil(total / take),
      },
    };
  }

  async getJobById(jobId: string) {
    const job = await this.repo.findById(jobId);
    if (!job) throw new NotFoundException('Job not found');
    return {
      id: job.id,
      title: job.title,
      description: job.description,
      category: (job as { category: string }).category,
      budget: job.budget,
      deadline: job.deadline.toISOString().split('T')[0],
      status: (job as { status: string }).status,
    };
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
    return {
      id: job.id,
      title: job.title,
      description: job.description,
      category: (job as { category: string }).category,
      budget: job.budget,
      deadline: (job as { deadline: Date }).deadline.toISOString().split('T')[0],
      status: (job as { status: string }).status,
    };
  }

  async listMyJobs(employerId: string, page: number = 1) {
    const { take, skip } = getPaginationParams(page);
    const [jobs, total] = await Promise.all([
      this.repo.findManyByEmployerId(employerId, skip, take),
      this.repo.countByEmployerId(employerId),
    ]);
    return {
      data: jobs.map((j) => ({
        id: j.id,
        title: j.title,
        description: j.description,
        category: (j as { category: string }).category,
        budget: j.budget,
        deadline: j.deadline.toISOString().split('T')[0],
        status: (j as { status: string }).status,
      })),
      meta: {
        page,
        total,
        totalPages: total === 0 ? 1 : Math.ceil(total / take),
      },
    };
  }
}
