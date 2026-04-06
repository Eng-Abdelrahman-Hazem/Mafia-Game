import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  const prisma = {
    player: { count: jest.fn() },
    analyticsEvent: { count: jest.fn() }
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calculates email bind conversion', async () => {
    const service = new AnalyticsService(prisma);
    prisma.player.count
      .mockResolvedValueOnce(100)
      .mockResolvedValueOnce(25);
    prisma.analyticsEvent.count.mockResolvedValue(27);

    const result = await service.getEmailBindFunnel(14);

    expect(result.newPlayers).toBe(100);
    expect(result.boundPlayers).toBe(25);
    expect(result.bindEvents).toBe(27);
    expect(result.conversionRate).toBe(25);
  });
});
