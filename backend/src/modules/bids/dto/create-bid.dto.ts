import { IsUUID } from 'class-validator';

export class CreateBidDto {
  @IsUUID('4', { message: 'job_id must be a valid UUID' })
  job_id: string;
}