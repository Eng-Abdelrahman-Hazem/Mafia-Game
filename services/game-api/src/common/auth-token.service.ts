import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';

interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthTokenService {
  private readonly ttlSec = 60 * 60 * 24 * 30; // 30 days

  issueToken(playerId: string): string {
    const now = Math.floor(Date.now() / 1000);
    const payload: TokenPayload = {
      sub: playerId,
      iat: now,
      exp: now + this.ttlSec
    };

    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = this.sign(payloadB64);
    return `${payloadB64}.${signature}`;
  }

  verifyToken(rawToken: string): TokenPayload {
    const [payloadB64, signature] = rawToken.split('.');
    if (!payloadB64 || !signature) {
      throw new UnauthorizedException('Malformed token');
    }

    const expected = this.sign(payloadB64);
    const actual = Buffer.from(signature);
    const expectedBuf = Buffer.from(expected);

    if (actual.length !== expectedBuf.length || !timingSafeEqual(actual, expectedBuf)) {
      throw new UnauthorizedException('Invalid token signature');
    }

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString()) as TokenPayload;

    if (!payload.sub || payload.exp <= Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Expired token');
    }

    return payload;
  }

  private sign(payloadB64: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 16) {
      throw new UnauthorizedException('JWT_SECRET is not configured safely');
    }

    return createHmac('sha256', secret).update(payloadB64).digest('base64url');
  }
}
