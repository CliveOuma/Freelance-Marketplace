import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Check duplicates concurrently for better performance (instead of sequential checks)
    const [existingEmail, existingUsername] = await Promise.all([
      this.prisma.user.findUnique({ where: { email: dto.email } }),
      this.prisma.user.findUnique({ where: { username: dto.username } }),
    ]);

    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    // Secure password hashing
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // Remove plain password from DTO
    const { password, ...rest } = dto;

    const user = await this.prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword,
        role: dto.role ?? 'WRITER', // enforce default role
      },
    });

    // Sign JWT with minimal payload (avoid sensitive info, only what's needed for auth/authorization)
    const token = this.jwt.sign({
      sub: user.id,
      role: user.role,
    });

    // password hashing
    const { password: _pw, ...safeUser } = user;

    return { token, user: safeUser };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Generic error message (don't reveal if email or password was incorrect)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwt.sign({
      sub: user.id,
      role: user.role,
    });

    const { password: _pw, ...safeUser } = user;

    return { token, user: safeUser };
  }
}