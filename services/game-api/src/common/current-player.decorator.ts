import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const CurrentPlayerId = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<{ playerId?: string }>();

  if (!req.playerId) {
    throw new UnauthorizedException('Player context missing');
  }

  return req.playerId;
});
