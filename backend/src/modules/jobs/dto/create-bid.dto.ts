import { IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateBidDto {
  @IsUUID('4', { message: 'job_id must be a valid UUID' })
  job_id: string;

  @IsNumber()
  @Min(0.01, { message: 'bid_amount must be positive' })
  bid_amount: number;

  @IsString()
  message: string;
}
