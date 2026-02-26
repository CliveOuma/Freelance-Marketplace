import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector allows us to read metadata set by custom decorators (e.g., @Roles())
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', ctx.getHandler());

      // If no roles are specified on the route, allow access by default
    if (!roles) return true;

    const request = ctx.switchToHttp().getRequest();


    return roles.includes(request.user.role);
  }
}