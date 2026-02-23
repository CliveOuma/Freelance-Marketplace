import { IsString, IsNumber, IsDateString, MinLength, Min } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsString()
  @MinLength(2)
  category: string;

  @IsNumber()
  @Min(0.01)
  budget: number;

  @IsDateString()
  deadline: string;
}
