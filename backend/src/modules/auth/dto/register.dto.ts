import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform, Expose } from 'class-transformer';
import { Role } from '../../common/enums/role.enum';

export class RegisterDto {
  @IsString() firstName: string;
  @IsString() lastName: string;
  // Accept "userName" or "username" from JSON; both map to username.
  @Expose({ name: 'userName' })
  @Transform(({ value, obj }) => value ?? obj?.userName ?? obj?.username)
  @IsString()
  username: string;
  @IsEmail() email: string;
  // since phone numbers are typically sent as strings to preserve formatting.
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  // Minimum 6 characters for basic password strength.
  @MinLength(6)
  password: string;

  // If omitted, AuthService defaults to WRITER role.
  @IsOptional()
  role?: Role; 
}
