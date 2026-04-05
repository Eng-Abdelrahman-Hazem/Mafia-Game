import { BadRequestException } from '@nestjs/common';
import { EventsService } from './events.service';

describe('EventsService', () => {
  const prisma = {
    liveEvent: { findMany: jest.fn(), findUnique: jest.fn() },
    playerEventScore: { upsert: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    playerResource: { update: jest.fn() },
    $transaction: jest.fn()
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
    prisma.$transaction.mockImplementation(async (fn: any) =>
      fn({
        playerEventScore: prisma.playerEventScore,
        playerResource: prisma.playerResource
      })
    );
  });

  it('adds score to an active event', async () => {
    const service = new EventsService(prisma);
    prisma.liveEvent.findUnique.mockResolvedValue({
      id: 'e1',
      startsAt: new Date(Date.now() - 1000),
      endsAt: new Date(Date.now() + 3600_000),
      template: { isActive: true }
    });
    prisma.playerEventScore.upsert.mockResolvedValue({ points: 20 });

    const result = await service.addScore('p1', 'e1', { actionType: 'crime_complete', quantity: 2 });

    expect(result.delta).toBe(20);
    expect(result.points).toBe(20);
  });

  it('rejects double reward claim', async () => {
    const service = new EventsService(prisma);
    prisma.liveEvent.findUnique.mockResolvedValue({
      id: 'e1',
      startsAt: new Date(Date.now() - 1000),
      endsAt: new Date(Date.now() + 3600_000),
      template: {
        isActive: true,
        rewards: [{ minPoints: 10, cash: 100, influence: 1, gems: 0 }]
      }
    });

    prisma.playerEventScore.findUnique.mockResolvedValue({
      points: 20,
      claimedAt: new Date()
    });

    await expect(service.claimEventReward('p1', 'e1')).rejects.toBeInstanceOf(BadRequestException);
  });
});
