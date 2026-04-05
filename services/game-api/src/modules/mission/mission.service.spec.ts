import { BadRequestException } from '@nestjs/common';
import { MissionService } from './mission.service';

describe('MissionService', () => {
  const prisma = {
    player: { findUnique: jest.fn() },
    missionTemplate: { findUnique: jest.fn(), findMany: jest.fn() },
    missionRun: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    missionPayoutJob: { create: jest.fn(), updateMany: jest.fn() },
    playerResource: { update: jest.fn() },
    $transaction: jest.fn()
  } as any;
  const liveEventScoreService = { safeAwardActionPoints: jest.fn() } as any;

  beforeEach(() => {
    jest.resetAllMocks();
    liveEventScoreService.safeAwardActionPoints.mockResolvedValue({ updatedEvents: 0, awardedPoints: 0 });
    prisma.$transaction.mockImplementation(async (fn: any) =>
      fn({
        playerResource: prisma.playerResource,
        missionRun: prisma.missionRun,
        missionPayoutJob: prisma.missionPayoutJob
      })
    );
  });

  it('rejects mission start when energy is insufficient', async () => {
    const service = new MissionService(prisma, liveEventScoreService);

    prisma.player.findUnique.mockResolvedValue({ id: 'p1', resources: { energy: 2 } });
    prisma.missionTemplate.findUnique.mockResolvedValue({ id: 'm1', energyCost: 5, durationSec: 10 });

    await expect(service.startMission('p1', { missionTemplateId: 'm1' })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('claims completed mission and grants rewards', async () => {
    const service = new MissionService(prisma, liveEventScoreService);

    prisma.missionRun.findUnique.mockResolvedValue({
      id: 'run1',
      playerId: 'p1',
      status: 'RUNNING',
      endsAt: new Date(Date.now() - 1000),
      missionTemplate: { cashReward: 100, influenceReward: 5 }
    });

    const result = await service.claimMission('p1', 'run1');

    expect(result.claimed).toBe(true);
    expect(prisma.missionRun.update).toHaveBeenCalled();
    expect(prisma.playerResource.update).toHaveBeenCalled();
    expect(liveEventScoreService.safeAwardActionPoints).toHaveBeenCalledWith('p1', 'crime_complete');
describe('MissionService', () => {
  it('should add tests for energy validation and mission creation', () => {
    expect(true).toBe(true);
  });
});
