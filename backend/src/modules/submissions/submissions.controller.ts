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

import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

//DTO for submission creation
export class CreateSubmissionDto {
  @IsNotEmpty({ message: 'job_id is required' })
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  job_id: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  notes?: string;
}

//Typed Request with user
interface RequestWithUser {
  user: {
    id: string;
    role: Role;
  };
}

//Upload directory from env or default
const SUBMISSIONS_UPLOAD_DIR =
  process.env.SUBMISSIONS_UPLOAD_DIR || join('uploads', 'submissions');

if (!existsSync(SUBMISSIONS_UPLOAD_DIR)) {
  mkdirSync(SUBMISSIONS_UPLOAD_DIR, { recursive: true });
}

@Controller('submissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.WRITER)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  //List paginated submissions for the logged-in writer
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

  //Get a single submission by ID for the logged-in writer
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

  //Upload a new submission for a job
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: SUBMISSIONS_UPLOAD_DIR,
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname) || '.bin';
          cb(null, `${randomUUID()}${ext}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
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
  async uploadSubmission(
    @Req() req: RequestWithUser,
    @UploadedFile() file?: Express.Multer.File,
    @Body() dto?: CreateSubmissionDto,
  ) {
    if (!file) {
      throw new BadRequestException(
        'File is required (multipart/form-data)',
      );
    }

    if (!dto || !dto.job_id) {
      throw new BadRequestException('job_id is required');
    }

    const filePath = join(SUBMISSIONS_UPLOAD_DIR, file.filename);

    try {
      const submission = await this.submissionsService.createSubmission(
        req.user.id,
        dto.job_id,
        filePath,
        dto.notes,
      );
      return { success: true, submission };
    } catch (error) {
      // catch DB or service errors
      throw new BadRequestException(error.message || 'Failed to upload submission');
    }
  }
}