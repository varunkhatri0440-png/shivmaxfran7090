import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    // Check X-Admin-Api-Key header or Authorization: Bearer <key>
    const apiKeyHeader = request.headers['x-admin-api-key'];
    const authHeader = request.headers['authorization'];

    let providedKey: string | undefined;

    if (typeof apiKeyHeader === 'string') {
      providedKey = apiKeyHeader.trim();
    } else if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      providedKey = authHeader.substring(7).trim();
    }

    const expectedKey =
      process.env.ADMIN_API_KEY?.trim() || 'shivmax-dev-admin-secret-key-change-in-prod';

    if (!providedKey || providedKey !== expectedKey) {
      throw new UnauthorizedException(
        'Access Denied: Valid Administrative API Key is required to view confidential inquiries.',
      );
    }

    return true;
  }
}
