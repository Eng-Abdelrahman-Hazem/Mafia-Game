import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class GameplayService {
  constructor(private readonly prisma: PrismaService) {}

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
      raidTargets: targets.map((t) => ({ id: t.id, handle: t.handle, powerRating: t.powerRating, cash: t.resources?.cash ?? 0 }))
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

    await this.prisma.$transaction(async (tx) => {
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

    return {
      success: true,
      rewards: {
        cash: template.cashReward,
        influence: template.influenceReward
      }
    };
  }
}
