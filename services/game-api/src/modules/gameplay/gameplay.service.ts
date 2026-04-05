import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';
import { LiveEventScoreService } from '../../common/live-event-score.service';

type RaidTargetRow = {
  id: string;
  handle: string;
  powerRating: number;
  resources: { cash: number } | null;
};

@Injectable()
export class GameplayService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly liveEventScoreService: LiveEventScoreService
  ) {}

  async getHome(playerId: string) {
    const [profile, templates, activeRuns, targets] = await Promise.all([
      this.prisma.player.findUnique({ where: { id: playerId }, include: { resources: true } }),
      this.prisma.missionTemplate.findMany({ where: { isActive: true }, take: 6 }),
      this.prisma.missionRun.findMany({ where: { playerId, status: 'RUNNING' }, orderBy: { endsAt: 'asc' }, take: 5 }),
      this.prisma.player.findMany({
        where: { isBot: true, NOT: { id: playerId } },
        include: { resources: true },
        take: 5
      })
    ]);

    if (!profile || !profile.resources) {
      throw new BadRequestException('Player not found');
    }

    return {
      profile: {
        id: profile.id,
        handle: profile.handle,
        faction: profile.faction,
        powerRating: profile.powerRating,
        resources: profile.resources
      },
      missions: templates,
      activeRuns,
      raidTargets: (targets as RaidTargetRow[]).map((t) => ({
        id: t.id,
        handle: t.handle,
        powerRating: t.powerRating,
        cash: t.resources?.cash ?? 0
      }))
    };
  }

  async instantCrime(playerId: string, missionTemplateId: string) {
    const [player, template] = await Promise.all([
      this.prisma.player.findUnique({ where: { id: playerId }, include: { resources: true } }),
      this.prisma.missionTemplate.findUnique({ where: { id: missionTemplateId } })
    ]);

    if (!player?.resources || !template) {
      throw new BadRequestException('Invalid crime request');
    }

    if (player.resources.energy < template.energyCost) {
      throw new BadRequestException('Not enough energy');
    }

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.playerResource.update({
        where: { playerId },
        data: {
          energy: { decrement: template.energyCost },
          cash: { increment: template.cashReward },
          influence: { increment: template.influenceReward },
          heat: { increment: 1 }
        }
      });
    });

    await this.liveEventScoreService.safeAwardActionPoints(playerId, 'crime_complete');

    return {
      success: true,
      rewards: {
        cash: template.cashReward,
        influence: template.influenceReward
      }
    };
  }
}
