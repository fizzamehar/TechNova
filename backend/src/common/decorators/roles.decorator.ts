import { SetMetadata } from '@nestjs/common';

// Usage: apply @Roles('ADMIN') on a controller method to
// only allow admins to access that route
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
