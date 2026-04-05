import { WorkerService } from './worker.service';

describe('WorkerService', () => {
  const prisma = {
    missionPayoutJob: { findMany: jest.fn(), update: jest.fn() },
    missionRun: { findUnique: jest.fn(), update: jest.fn() },
    playerResource: { update: jest.fn() },
    $transaction: jest.fn()
  } as any;
  const liveEventScoreService = { safeAwardActionPoints: jest.fn() } as any;

  beforeEach(() => {
    jest.resetAllMocks();
    liveEventScoreService.safeAwardActionPoints.mockResolvedValue({ updatedEvents: 0, awardedPoints: 0 });
    prisma.$transaction.mockImplementation(async (fn: any) =>
      fn({
        missionPayoutJob: prisma.missionPayoutJob,
        missionRun: prisma.missionRun,
        playerResource: prisma.playerResource
      })
    );
  });

  it('processes due pending jobs', async () => {
    const service = new WorkerService(prisma, liveEventScoreService);

    prisma.missionPayoutJob.findMany.mockResolvedValue([
      {
        id: 'j1',
        missionRunId: 'r1',
        playerId: 'p1',
        missionRun: { missionTemplate: { cashReward: 100, influenceReward: 2 } }
      }
    ]);
    prisma.missionRun.findUnique.mockResolvedValue({
      id: 'r1',
      status: 'RUNNING',
      missionTemplate: { cashReward: 100, influenceReward: 2 }
    });

    const result = await service.processMissionPayouts();
    expect(result.processed).toBe(1);
    expect(result.completed).toBe(1);
    expect(prisma.playerResource.update).toHaveBeenCalled();
    expect(liveEventScoreService.safeAwardActionPoints).toHaveBeenCalledWith('p1', 'crime_complete');
  });
});
