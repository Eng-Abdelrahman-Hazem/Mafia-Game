import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{ headers: Record<string, string> }>();
    const provided = req.headers['x-admin-key'];
    const expected = process.env.ADMIN_API_KEY;

    if (!expected || expected.length < 16) {
      throw new ForbiddenException('ADMIN_API_KEY is not configured safely');
    }

    if (!provided || provided !== expected) {
      throw new ForbiddenException('Admin key is invalid');
    }

    return true;
  }
}
