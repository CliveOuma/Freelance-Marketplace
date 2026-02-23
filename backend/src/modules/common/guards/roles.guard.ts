// Enforces role-based access control (RBAC) at the route level
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector allows us to read metadata set by custom decorators (e.g., @Roles())
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    //Read the roles metadata that was attached using the @Roles() decorator.
    const roles = this.reflector.get<string[]>('roles', ctx.getHandler());

    //If no roles metadata is found, the route is public (no role restriction),
    if (!roles) return true;

    /**
     * Extract the HTTP request object from the execution context.
     * request.user is populated earlier by JwtAuthGuard after validating the JWT.
     */
    const request = ctx.switchToHttp().getRequest();

    //Check if the authenticated user's role is included in the allowed roles.
    return roles.includes(request.user.role);
  }
}