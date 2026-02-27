import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'firstName must be at least 3 characters' })
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'lastName must be at least 3 characters' })
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  lastName?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'username must be at least 3 characters' })
  @MaxLength(50)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  username?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ValidateIf((o) => o.phoneNumber != null && o.phoneNumber !== '')
  @Matches(/^(07\d{8}|01\d{8}|\+254[17]\d{8})$/, {
    message:
      'phoneNumber must be valid',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.startsWith('0')
        ? '+254' + value.slice(1)
        : value
      : value,
  )
  phoneNumber?: string | null;
}