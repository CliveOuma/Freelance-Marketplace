import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';
import { SubmissionsService } from '../services/submissions.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
// CreateSubmissionDto not required for route with jobId in URL

//Typed Request with user info from JWT guard
interface RequestWithUser {
  user: {
    id: string;
    role: Role;
  };
}

const SUBMISSIONS_UPLOAD_DIR =
  process.env.SUBMISSIONS_UPLOAD_DIR || join('uploads', 'submissions');

if (!existsSync(SUBMISSIONS_UPLOAD_DIR)) {
  mkdirSync(SUBMISSIONS_UPLOAD_DIR, { recursive: true });
}

@Controller('submissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.WRITER)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) { }

  @Get()
  async listSubmissions(
    @Req() req: RequestWithUser,
    @Query() query: PaginationQueryDto,
  ) {
    const page = query.page ?? 1;
    const submissions = await this.submissionsService.listSubmissions(
      req.user.id,
      page,
    );
    return { success: true, page, submissions };
  }

  @Get(':submissionId')
  async getSubmission(
    @Req() req: RequestWithUser,
    @Param('submissionId') submissionId: string,
  ) {
    const submission = await this.submissionsService.getSubmissionById(
      req.user.id,
      submissionId,
    );
    if (!submission) {
      throw new BadRequestException('Submission not found');
    }
    return { success: true, submission };
  }

  // Upload a new submission for a job
  @Post('/jobs/:jobId/submissions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.WRITER)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: SUBMISSIONS_UPLOAD_DIR,
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname) || '.bin';
          cb(null, `${randomUUID()}${ext}`);
        },
      }),
      limits: { fileSize: 20 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const allowed = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (!allowed.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              'Only PDF and Word documents (.doc, .docx) are allowed',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async createSubmission(
    @Param('jobId') jobId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('notes') notes: string,
    @Req() req: { user: { id: string } },
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const filePath = join(SUBMISSIONS_UPLOAD_DIR, file.filename);

    try {
      const submission = await this.submissionsService.createSubmission(
        req.user.id,
        jobId,
        filePath,
        notes,
      );
      return { success: true, submission };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to upload submission');
    }
  }
}