import { LiveEventScoreService } from './live-event-score.service';

describe('LiveEventScoreService', () => {
  const prisma = {
    liveEvent: { findMany: jest.fn() },
    playerEventScore: { upsert: jest.fn() }
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('awards points into all active events', async () => {
    const service = new LiveEventScoreService(prisma);
    prisma.liveEvent.findMany.mockResolvedValue([{ id: 'e1' }, { id: 'e2' }]);

    const result = await service.awardActionPoints('p1', 'crime_complete', 2);

    expect(result.updatedEvents).toBe(2);
    expect(result.awardedPoints).toBe(20);
    expect(prisma.playerEventScore.upsert).toHaveBeenCalledTimes(2);
  });

  it('does nothing for invalid quantity', async () => {
    const service = new LiveEventScoreService(prisma);

    const result = await service.awardActionPoints('p1', 'crime_complete', 0);

    expect(result.updatedEvents).toBe(0);
    expect(prisma.liveEvent.findMany).not.toHaveBeenCalled();
  });
});
