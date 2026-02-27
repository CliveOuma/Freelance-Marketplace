import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { SubmissionsRepository } from '../repositories/submissions.repository';
import { PrismaService } from '../../../prisma/prisma.service';
import { getPaginationParams } from '../../../common/constants/pagination';

@Injectable()
export class SubmissionsService {
  constructor(
    private readonly submissionsRepo: SubmissionsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async createSubmission(
    writerId: string,
    jobId: string,
    filePath: string,
    notes?: string,
  ) {
    const job = await this.prisma['job'].findUnique({
      where: { id: jobId },
    });
    if (!job) throw new NotFoundException('Job not found');
    if (String((job as { status: string }).status) !== 'IN_PROGRESS')
      throw new BadRequestException(
        'Submissions are only accepted for jobs in progress',
      );

    const submission = await this.submissionsRepo.create({
      writerId,
      jobId,
      filePath,
      notes,
    });

    return {
      message: 'Submission uploaded successfully',
      status: (submission as unknown as { status: string }).status,
      id: submission.id,
    };
  }

  async listSubmissions(writerId: string, page: number = 1) {
    const { take, skip } = getPaginationParams(page);
    const [submissions, total] = await Promise.all([
      this.submissionsRepo.findManyByWriterId(writerId, skip, take),
      this.submissionsRepo.countByWriterId(writerId),
    ]);

    return {
      data: submissions.map((s) => ({
        id: s.id,
        job_id: s.jobId,
        job_title: (s.job as { title: string }).title,
        job_status: (s.job as { status: string }).status,
        file_path: s.filePath,
        notes: s.notes ?? undefined,
        status: (s as unknown as { status: string }).status,
        created_at: s.createdAt,
      })),
      meta: {
        page,
        total,
        totalPages: total === 0 ? 1 : Math.ceil(total / take),
      },
    };
  }

  async getSubmissionById(writerId: string, submissionId: string) {
    const submission = await this.submissionsRepo.findById(submissionId);
    if (!submission) throw new NotFoundException('Submission not found');
    if ((submission as { writerId: string }).writerId !== writerId)
      throw new ForbiddenException('You can only view your own submissions');
    return {
      id: submission.id,
      job_id: submission.jobId,
      job_title: (submission.job as { title: string }).title,
      job_status: (submission.job as { status: string }).status,
      file_path: submission.filePath,
      notes: submission.notes ?? undefined,
      status: (submission as unknown as { status: string }).status,
      created_at: submission.createdAt,
    };
  }
}
