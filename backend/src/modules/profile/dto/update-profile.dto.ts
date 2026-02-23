import {
  IsString,
  IsOptional,
  MinLength,
  IsPhoneNumber,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * DTO for PATCH /api/profile.
 * Only editable fields; id, role, email, password, rating, createdAt are restricted.
 */
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
  @IsPhoneNumber(undefined, { message: 'phoneNumber must be a valid' })
  phoneNumber?: string | null;
}
