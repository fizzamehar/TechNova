import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// This guard protects the route — access is denied without a valid JWT token
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
