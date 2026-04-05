import { GameplayService } from './gameplay.service';
import { BadRequestException } from '@nestjs/common';

describe('GameplayService', () => {
  const prisma = {
    player: { findUnique: jest.fn(), findMany: jest.fn() },
    missionTemplate: { findMany: jest.fn(), findUnique: jest.fn() },
    missionRun: { findMany: jest.fn() },
    playerResource: { update: jest.fn() },
    $transaction: jest.fn()
  } as any;
  const liveEventScoreService = { safeAwardActionPoints: jest.fn() } as any;

  beforeEach(() => {
    jest.resetAllMocks();
    liveEventScoreService.safeAwardActionPoints.mockResolvedValue({ updatedEvents: 0, awardedPoints: 0 });
    prisma.$transaction.mockImplementation(async (fn: any) => fn({ playerResource: prisma.playerResource }));
  });

  it('returns home payload with profile and raid targets', async () => {
    const service = new GameplayService(prisma, liveEventScoreService);

    prisma.player.findUnique.mockResolvedValue({ id: 'p1', handle: 'Boss', faction: 'DOCK_SERPENTS', powerRating: 100, resources: { cash: 1 } });
    prisma.missionTemplate.findMany.mockResolvedValue([{ id: 'm1' }]);
    prisma.missionRun.findMany.mockResolvedValue([]);
    prisma.player.findMany.mockResolvedValue([{ id: 'b1', handle: 'Bot_1', powerRating: 80, resources: { cash: 100 } }]);

    const result = await service.getHome('p1');

    expect(result.profile.id).toBe('p1');
    expect(result.raidTargets).toHaveLength(1);
  });

  it('rejects instant crime when no energy', async () => {
    const service = new GameplayService(prisma, liveEventScoreService);

    prisma.player.findUnique.mockResolvedValue({ id: 'p1', resources: { energy: 0 } });
    prisma.missionTemplate.findUnique.mockResolvedValue({ id: 'm1', energyCost: 5, cashReward: 10, influenceReward: 1 });

    await expect(service.instantCrime('p1', 'm1')).rejects.toBeInstanceOf(BadRequestException);
  });
});
