import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';


export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'page must be at least 1' })
  page?: number = 1;
}
