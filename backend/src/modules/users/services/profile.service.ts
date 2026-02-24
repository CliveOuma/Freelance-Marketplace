import {
  Injectable,
  NotFoundException,
  ConflictException,
  HttpStatus,
} from '@nestjs/common';
import { plainToClass, instanceToPlain } from 'class-transformer';
import { ProfileResponseDto } from '../dto/profile-response.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';

//Profile service: fetch and update authenticated user's profile.
@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  //Get profile by user id (from JWT)

  async getProfile(userId: string): Promise<Record<string, unknown>> {
    const user = await this.prisma['user'].findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Exclude password
    const dto = plainToClass(ProfileResponseDto, user, {
      excludeExtraneousValues: true,
    });
    return instanceToPlain(dto) as Record<string, unknown>;
  }

  //Update only allowed fields. Checks username uniqueness.
  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<Record<string, unknown>> {
    const user = await this.prisma['user'].findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If username is being updated, ensure it's not taken by another user
    if (dto.username !== undefined && dto.username !== user.username) {
      const existing = await this.prisma['user'].findUnique({
        where: { username: dto.username },
      });
      if (existing) {
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          message: 'Username already taken',
          error: 'Conflict',
        });
      }
    }

    const updated = await this.prisma['user'].update({
      where: { id: userId },
      data: {
        ...(dto.firstName !== undefined && { firstName: dto.firstName }),
        ...(dto.lastName !== undefined && { lastName: dto.lastName }),
        ...(dto.username !== undefined && { username: dto.username }),
        ...(dto.phoneNumber !== undefined && {
          phoneNumber: dto.phoneNumber === '' ? null : dto.phoneNumber,
        }),
      },
    });

    const responseDto = plainToClass(ProfileResponseDto, updated, {
      excludeExtraneousValues: true,
    });
    return instanceToPlain(responseDto) as Record<string, unknown>;
  }
}
