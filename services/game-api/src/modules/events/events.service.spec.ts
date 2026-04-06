import { BadRequestException } from '@nestjs/common';
import { EventsService } from './events.service';

describe('EventsService', () => {
  const prisma = {
    liveEvent: { findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), create: jest.fn() },
    playerEventScore: { upsert: jest.fn(), findUnique: jest.fn(), update: jest.fn(), findMany: jest.fn() },
    eventScoreActionLog: { findUnique: jest.fn(), create: jest.fn(), count: jest.fn(), aggregate: jest.fn() },
    eventLeaderboardSnapshot: { createMany: jest.fn(), findFirst: jest.fn(), findMany: jest.fn() },
    eventRewardPayout: { findUnique: jest.fn(), create: jest.fn() },
    playerResource: { update: jest.fn() },
    $transaction: jest.fn()
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
    prisma.eventScoreActionLog.count.mockResolvedValue(0);
    prisma.eventScoreActionLog.aggregate.mockResolvedValue({ _sum: { appliedPoints: 0 } });
    prisma.$transaction.mockImplementation(async (fn: any) =>
      fn({
        liveEvent: prisma.liveEvent,
        playerEventScore: prisma.playerEventScore,
        eventScoreActionLog: prisma.eventScoreActionLog,
        eventRewardPayout: prisma.eventRewardPayout,
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

  it('returns leaderboard ordered by points desc', async () => {
    const service = new EventsService(prisma);
    prisma.playerEventScore.findMany.mockResolvedValue([
      { playerId: 'p2', points: 300, player: { handle: 'Boss2' } },
      { playerId: 'p1', points: 250, player: { handle: 'Boss1' } }
    ]);

    const result = await service.getLeaderboard('e1', 10);

    expect(result[0]).toEqual({ rank: 1, playerId: 'p2', handle: 'Boss2', points: 300 });
    expect(result[1]).toEqual({ rank: 2, playerId: 'p1', handle: 'Boss1', points: 250 });
  });

  it('creates leaderboard snapshot rows', async () => {
    const service = new EventsService(prisma);
    prisma.playerEventScore.findMany.mockResolvedValue([
      { playerId: 'p1', points: 250, createdAt: new Date() },
      { playerId: 'p2', points: 200, createdAt: new Date() }
    ]);
    prisma.eventLeaderboardSnapshot.createMany.mockResolvedValue({ count: 2 });

    const result = await service.snapshotLeaderboard('e1', 50);

    expect(result.captured).toBe(2);
    expect(prisma.eventLeaderboardSnapshot.createMany).toHaveBeenCalled();
  });

  it('settles rewards from the latest snapshot', async () => {
    const service = new EventsService(prisma);
    const snapshotAt = new Date('2026-01-01T00:00:00.000Z');
    prisma.eventLeaderboardSnapshot.findFirst.mockResolvedValue({ snapshotAt });
    prisma.eventLeaderboardSnapshot.findMany.mockResolvedValue([
      { playerId: 'p1', rank: 1, points: 500 },
      { playerId: 'p2', rank: 8, points: 300 }
    ]);
    prisma.eventRewardPayout.findUnique.mockResolvedValue(null);

    const result = await service.settleSnapshotRewards('e1', 100);

    expect(result.processed).toBe(2);
    expect(result.paid).toBe(2);
    expect(prisma.eventRewardPayout.create).toHaveBeenCalledTimes(2);
    expect(prisma.playerResource.update).toHaveBeenCalledTimes(2);
  });

  it('rolls over event season by snapshotting, settling, and creating next event', async () => {
    const service = new EventsService(prisma);
    const currentSnapshot = new Date('2026-01-01T00:00:00.000Z');
    prisma.liveEvent.findUnique.mockResolvedValue({
      id: 'e1',
      templateId: 't1',
      template: { durationHours: 24 }
    });
    prisma.playerEventScore.findMany.mockResolvedValue([
      { playerId: 'p1', points: 500, createdAt: new Date(), player: { handle: 'Boss1' } }
    ]);
    prisma.eventLeaderboardSnapshot.createMany.mockResolvedValue({ count: 1 });
    prisma.eventLeaderboardSnapshot.findFirst.mockResolvedValue({ snapshotAt: currentSnapshot });
    prisma.eventLeaderboardSnapshot.findMany.mockResolvedValue([{ playerId: 'p1', rank: 1, points: 500 }]);
    prisma.eventRewardPayout.findUnique.mockResolvedValue(null);
    prisma.liveEvent.create.mockResolvedValue({ id: 'next-event' });

    const result = await service.runEventSeasonRollover('e1', 100);

    expect(result.rolledOver).toBe(true);
    expect(result.nextEventId).toBe('next-event');
    expect(prisma.liveEvent.update).toHaveBeenCalled();
    expect(prisma.liveEvent.create).toHaveBeenCalled();
  });
});
