import { BadRequestException } from '@nestjs/common';
import { EventsService } from './events.service';

describe('EventsService', () => {
  const prisma = {
    liveEvent: { findMany: jest.fn(), findUnique: jest.fn() },
    playerEventScore: { upsert: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    eventScoreActionLog: { findUnique: jest.fn(), create: jest.fn(), count: jest.fn(), aggregate: jest.fn() },
    playerResource: { update: jest.fn() },
    $transaction: jest.fn()
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
    prisma.eventScoreActionLog.count.mockResolvedValue(0);
    prisma.eventScoreActionLog.aggregate.mockResolvedValue({ _sum: { appliedPoints: 0 } });
    prisma.$transaction.mockImplementation(async (fn: any) =>
      fn({
        playerEventScore: prisma.playerEventScore,
        eventScoreActionLog: prisma.eventScoreActionLog,
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
    expect(result.replayed).toBe(false);
    expect(prisma.eventScoreActionLog.create).toHaveBeenCalled();
  });

  it('treats repeated idempotency key as replay without duplicate points', async () => {
    const service = new EventsService(prisma);
    prisma.liveEvent.findUnique.mockResolvedValue({
      id: 'e1',
      startsAt: new Date(Date.now() - 1000),
      endsAt: new Date(Date.now() + 3600_000),
      template: { isActive: true }
    });
    prisma.eventScoreActionLog.findUnique.mockResolvedValue({
      id: 'log-1',
      liveEventId: 'e1',
      playerId: 'p1',
      idempotencyKey: 'req-123'
    });
    prisma.playerEventScore.findUnique.mockResolvedValue({ points: 42 });

    const result = await service.addScore('p1', 'e1', {
      actionType: 'crime_complete',
      quantity: 2,
      idempotencyKey: 'req-123'
    });

    expect(result.replayed).toBe(true);
    expect(result.delta).toBe(0);
    expect(result.points).toBe(42);
    expect(prisma.playerEventScore.upsert).not.toHaveBeenCalled();
    expect(prisma.eventScoreActionLog.create).not.toHaveBeenCalled();
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

  it('rejects event scoring when rate limit is exceeded', async () => {
    const service = new EventsService(prisma);
    prisma.liveEvent.findUnique.mockResolvedValue({
      id: 'e1',
      startsAt: new Date(Date.now() - 1000),
      endsAt: new Date(Date.now() + 3600_000),
      template: { isActive: true }
    });
    prisma.eventScoreActionLog.count.mockResolvedValue(30);

    await expect(
      service.addScore('p1', 'e1', { actionType: 'crime_complete', quantity: 1, idempotencyKey: 'new-req' })
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects event scoring when daily points cap is exceeded', async () => {
    const service = new EventsService(prisma);
    prisma.liveEvent.findUnique.mockResolvedValue({
      id: 'e1',
      startsAt: new Date(Date.now() - 1000),
      endsAt: new Date(Date.now() + 3600_000),
      template: { isActive: true }
    });
    prisma.eventScoreActionLog.aggregate.mockResolvedValue({ _sum: { appliedPoints: 1995 } });

    await expect(
      service.addScore('p1', 'e1', { actionType: 'crime_complete', quantity: 1, idempotencyKey: 'new-req' })
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
