import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { StartMissionDto } from './dto';

@Injectable()
export class MissionService {
  constructor(private readonly prisma: PrismaService) {}

  async listTemplates() {
    return this.prisma.missionTemplate.findMany({ where: { isActive: true } });
  }

  async startMission(playerId: string, input: StartMissionDto) {
    const [player, template] = await Promise.all([
      this.prisma.player.findUnique({ where: { id: playerId }, include: { resources: true } }),
      this.prisma.missionTemplate.findUnique({ where: { id: input.missionTemplateId } })
    ]);

    if (!player || !player.resources || !template) {
      throw new BadRequestException('Invalid mission request');
    }

    if (player.resources.energy < template.energyCost) {
      throw new BadRequestException('Not enough energy');
    }

    const now = new Date();
    const endsAt = new Date(now.getTime() + template.durationSec * 1000);

    const run = await this.prisma.$transaction(async (tx) => {
      await tx.playerResource.update({
        where: { playerId: player.id },
        data: { energy: { decrement: template.energyCost }, heat: { increment: 1 } }
      });

      return tx.missionRun.create({
        data: {
          playerId: player.id,
          missionTemplateId: template.id,
          startedAt: now,
          endsAt,
          status: 'RUNNING'
        },
        include: { missionTemplate: true }
      });
    });

    await this.prisma.missionPayoutJob.create({
      data: {
        missionRunId: run.id,
        playerId,
        dueAt: run.endsAt
      }
    });

    return run;
  }

  async claimMission(playerId: string, runId: string) {
    const run = await this.prisma.missionRun.findUnique({
      where: { id: runId },
      include: { missionTemplate: true }
    });

    if (!run || run.playerId !== playerId) {
      throw new BadRequestException('Mission run not found');
    }

    if (run.status !== 'RUNNING') {
      throw new BadRequestException('Mission already resolved');
    }

    if (run.endsAt > new Date()) {
      throw new BadRequestException('Mission not complete yet');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.missionRun.update({
        where: { id: run.id },
        data: { status: 'COMPLETED' }
      });

      await tx.playerResource.update({
        where: { playerId },
        data: {
          cash: { increment: run.missionTemplate.cashReward },
          influence: { increment: run.missionTemplate.influenceReward },
          heat: { decrement: 1 }
        }
      });

      await tx.missionPayoutJob.updateMany({
        where: { missionRunId: run.id, status: { in: ['PENDING', 'PROCESSING'] } },
        data: { status: 'DONE', attempts: { increment: 1 } }
      });

      return { claimed: true, runId: run.id };
    });
  }
}
