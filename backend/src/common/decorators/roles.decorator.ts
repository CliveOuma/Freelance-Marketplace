//It allows you to specify which user roles are allowed to access a specific endpoint.
import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
