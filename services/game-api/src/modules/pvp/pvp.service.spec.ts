import { PvpService } from './pvp.service';

describe('PvpService', () => {
  const prisma = {
    player: { findUnique: jest.fn() },
    playerResource: { update: jest.fn() },
    pvPRaidLog: { create: jest.fn() },
    pvPProtectionState: { findUnique: jest.fn(), upsert: jest.fn() },
    $transaction: jest.fn()
  } as any;

  const randomService = { next: jest.fn() };

  beforeEach(() => {
    jest.resetAllMocks();
    prisma.$transaction.mockImplementation(async (fn: any) =>
      fn({
        playerResource: prisma.playerResource,
        pvPRaidLog: prisma.pvPRaidLog,
        pvPProtectionState: prisma.pvPProtectionState
      })
    );
    prisma.pvPProtectionState.findUnique.mockResolvedValue(null);
  });

  it('awards stolen cash when raid succeeds', async () => {
    const service = new PvpService(prisma, randomService as any);

    prisma.player.findUnique
      .mockResolvedValueOnce({ id: 'atk', powerRating: 120, resources: { cash: 500 } })
      .mockResolvedValueOnce({ id: 'def', powerRating: 80, resources: { cash: 900 } });
    randomService.next.mockReturnValue(0.1);

    const result = await service.runRaid('atk', { defenderId: 'def' });

    expect(result.won).toBe(true);
    expect(result.stolenCash).toBe(900);
    expect(prisma.playerResource.update).toHaveBeenCalledTimes(2);
    expect(prisma.pvPRaidLog.create).toHaveBeenCalled();
    expect(prisma.pvPProtectionState.upsert).toHaveBeenCalled();
  });

  it('does not transfer resources when raid fails', async () => {
    const service = new PvpService(prisma, randomService as any);

    prisma.player.findUnique
      .mockResolvedValueOnce({ id: 'atk', powerRating: 100, resources: { cash: 100 } })
      .mockResolvedValueOnce({ id: 'def', powerRating: 100, resources: { cash: 800 } });
    randomService.next.mockReturnValue(0.99);

    const result = await service.runRaid('atk', { defenderId: 'def' });

    expect(result.won).toBe(false);
    expect(result.stolenCash).toBe(0);
    expect(prisma.playerResource.update).not.toHaveBeenCalled();
    expect(prisma.pvPRaidLog.create).toHaveBeenCalledTimes(1);
  });

  it('rejects raid when defender is shielded', async () => {
    const service = new PvpService(prisma, randomService as any);
    prisma.player.findUnique
      .mockResolvedValueOnce({ id: 'atk', powerRating: 100, resources: { cash: 100 } })
      .mockResolvedValueOnce({ id: 'def', powerRating: 100, resources: { cash: 800 } });
    prisma.pvPProtectionState.findUnique.mockResolvedValue({ shieldUntil: new Date(Date.now() + 60000) });

    await expect(service.runRaid('atk', { defenderId: 'def' })).rejects.toThrow('Target is shielded');
  });
});
