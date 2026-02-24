import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProfileResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  role: string;

  @Expose()
  phoneNumber: string | null;

  @Expose()
  bio: string | null;

  @Expose()
  skills: string[];

  @Expose()
  rating: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
