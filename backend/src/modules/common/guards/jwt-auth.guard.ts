//This guard protects routes so that only authenticated users with a valid JWT token can access them.
import { AuthGuard } from '@nestjs/passport';
export class JwtAuthGuard extends AuthGuard('jwt') {}
