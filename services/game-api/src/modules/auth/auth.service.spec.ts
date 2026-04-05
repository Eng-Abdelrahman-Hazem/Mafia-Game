import { BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const prisma = {
    player: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    analyticsEvent: { create: jest.fn() },
    $transaction: jest.fn()
  } as any;

  const authTokenService = {
    issueToken: jest.fn().mockReturnValue('token-1')
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
    authTokenService.issueToken.mockReturnValue('token-1');
    prisma.$transaction.mockImplementation(async (fn: any) =>
      fn({
        player: prisma.player,
        analyticsEvent: prisma.analyticsEvent
      })
    );
  });

  it('binds email and emits analytics event', async () => {
    const service = new AuthService(prisma, authTokenService);
    prisma.player.findUnique.mockResolvedValue(null);
    prisma.player.update.mockResolvedValue({
      id: 'p1',
      handle: 'Boss1',
      email: 'boss@example.com',
      emailBoundAt: new Date()
    });

    const result = await service.bindEmail('p1', { email: 'Boss@Example.com' });

    expect(result.bound).toBe(true);
    expect(prisma.player.update).toHaveBeenCalled();
    expect(prisma.analyticsEvent.create).toHaveBeenCalled();
  });

  it('rejects bind when email belongs to a different player', async () => {
    const service = new AuthService(prisma, authTokenService);
    prisma.player.findUnique.mockResolvedValue({ id: 'other-player' });

    await expect(service.bindEmail('p1', { email: 'taken@example.com' })).rejects.toBeInstanceOf(BadRequestException);
  });
});
