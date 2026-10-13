import { describe, it, expect } from 'vitest';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AdminAuthGuard } from './admin-auth.guard.js';

describe('AdminAuthGuard', () => {
  const guard = new AdminAuthGuard();

  const createMockContext = (headers: Record<string, string | undefined>): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ headers }),
        getResponse: () => ({}),
        getNext: () => ({}),
      }),
    } as unknown as ExecutionContext;
  };

  it('should throw UnauthorizedException when no API key or Authorization header is provided', () => {
    const context = createMockContext({});
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when invalid API key is provided', () => {
    const context = createMockContext({ 'x-admin-api-key': 'wrong-key-123' });
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should allow access when correct X-Admin-Api-Key is provided', () => {
    const expectedKey =
      process.env.ADMIN_API_KEY?.trim() || 'shivmax-dev-admin-secret-key-change-in-prod';
    const context = createMockContext({ 'x-admin-api-key': expectedKey });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access when correct Bearer token is provided in Authorization header', () => {
    const expectedKey =
      process.env.ADMIN_API_KEY?.trim() || 'shivmax-dev-admin-secret-key-change-in-prod';
    const context = createMockContext({ authorization: `Bearer ${expectedKey}` });
    expect(guard.canActivate(context)).toBe(true);
  });
});
