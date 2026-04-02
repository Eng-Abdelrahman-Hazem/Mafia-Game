import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class WorkerService {
  constructor(private readonly prisma: PrismaService) {}

  async processMissionPayouts(limit = 50) {
    const now = new Date();
    const jobs = await this.prisma.missionPayoutJob.findMany({
      where: { status: 'PENDING', dueAt: { lte: now } },
      include: { missionRun: { include: { missionTemplate: true } } },
      take: limit,
      orderBy: { dueAt: 'asc' }
    });

    let processed = 0;
    let completed = 0;

    for (const job of jobs) {
      processed += 1;

      try {
        await this.prisma.$transaction(async (tx) => {
          await tx.missionPayoutJob.update({
            where: { id: job.id },
            data: { status: 'PROCESSING', attempts: { increment: 1 } }
          });

          const liveRun = await tx.missionRun.findUnique({
            where: { id: job.missionRunId },
            include: { missionTemplate: true }
          });

          if (!liveRun || liveRun.status !== 'RUNNING') {
            await tx.missionPayoutJob.update({
              where: { id: job.id },
              data: { status: 'DONE' }
            });
            return;
          }

          await tx.missionRun.update({
            where: { id: job.missionRunId },
            data: { status: 'COMPLETED' }
          });

          await tx.playerResource.update({
            where: { playerId: job.playerId },
            data: {
              cash: { increment: liveRun.missionTemplate.cashReward },
              influence: { increment: liveRun.missionTemplate.influenceReward },
              heat: { decrement: 1 }
            }
          });

          await tx.missionPayoutJob.update({
            where: { id: job.id },
            data: { status: 'DONE', lastError: null }
          });
        });

        completed += 1;
      } catch (error) {
        await this.prisma.missionPayoutJob.update({
          where: { id: job.id },
          data: {
            status: 'FAILED',
            lastError: error instanceof Error ? error.message.slice(0, 500) : 'unknown error'
          }
        });
      }
    }

    return { processed, completed };
  }
}
