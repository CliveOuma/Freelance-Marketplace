// Handles secure registration & login logic only.
// No HTTP concerns; AuthController delegates to these methods.
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    // Check for duplicates in parallel. ConflictException returns HTTP 409,
    // which is appropriate for "resource already exists" scenarios.
    const [existingEmail, existingUsername] = await Promise.all([
      this.prisma.user.findUnique({ where: { email: dto.email } }),
      this.prisma.user.findUnique({ where: { username: dto.username } }),
    ]);
    if (existingEmail) throw new ConflictException('Email already exists');
    if (existingUsername)
      throw new ConflictException('Username already exists');

    // bcrypt with cost 10 for secure password hashing before storing.
    const hashed = await bcrypt.hash(dto.password, 10);

    // Exclude password from spread; we pass the hashed value explicitly.
    // skills is required by Prisma User model but not in DTO, so default to [].
    const { password: _, ...rest } = dto;
    const user = await this.prisma.user.create({
      data: {
        ...rest,
        password: hashed,
        role: (dto.role as 'ADMIN' | 'EMPLOYER' | 'WRITER') ?? 'WRITER',
        skills: [],
      },
    });

    const token = this.jwt.sign({ sub: user.id, role: user.role });

    // Strip password from response for security.
    return { token, user: { ...user, password: undefined } };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwt.sign({ sub: user.id, role: user.role });

    return { token, user: { ...user, password: undefined } };
  }
}
