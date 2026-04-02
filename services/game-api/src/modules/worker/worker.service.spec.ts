import { WorkerService } from './worker.service';

describe('WorkerService', () => {
  const prisma = {
    missionPayoutJob: { findMany: jest.fn(), update: jest.fn() },
    missionRun: { findUnique: jest.fn(), update: jest.fn() },
    playerResource: { update: jest.fn() },
    $transaction: jest.fn()
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
    prisma.$transaction.mockImplementation(async (fn: any) =>
      fn({
        missionPayoutJob: prisma.missionPayoutJob,
        missionRun: prisma.missionRun,
        playerResource: prisma.playerResource
      })
    );
  });

  it('processes due pending jobs', async () => {
    const service = new WorkerService(prisma);

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
  });
});
