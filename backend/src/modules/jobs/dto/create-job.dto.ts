import { IsString, IsNumber, IsDate, Min, MaxLength } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @MaxLength(2000)
  description: string;

  @IsString()
  @MaxLength(100)
  category: string;

  @IsNumber()
  @Min(0)
  budget: number;

  @IsDate()
  deadline: Date;
}
