import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';

export type EventActionType = 'crime_complete' | 'raid_win' | 'daily_login' | 'syndicate_donation';

export const ACTION_POINTS: Record<EventActionType, number> = {
  crime_complete: 10,
  raid_win: 18,
  daily_login: 5,
  syndicate_donation: 12
};

@Injectable()
export class LiveEventScoreService {
  private readonly logger = new Logger(LiveEventScoreService.name);

  constructor(private readonly prisma: PrismaService) {}

  async awardActionPoints(playerId: string, actionType: EventActionType, quantity = 1) {
    const basePoints = ACTION_POINTS[actionType];
    if (!basePoints || quantity <= 0) {
      return { updatedEvents: 0, awardedPoints: 0 };
    }

    const now = new Date();
    const activeEvents = await this.prisma.liveEvent.findMany({
      where: {
        startsAt: { lte: now },
        endsAt: { gt: now },
        template: { isActive: true }
      },
      select: { id: true }
    });

    if (activeEvents.length === 0) {
      return { updatedEvents: 0, awardedPoints: 0 };
    }

    const delta = basePoints * quantity;

    await Promise.all(
      activeEvents.map((event: { id: string }) =>
        this.prisma.playerEventScore.upsert({
          where: {
            liveEventId_playerId: {
              liveEventId: event.id,
              playerId
            }
          },
          update: { points: { increment: delta } },
          create: {
            liveEventId: event.id,
            playerId,
            points: delta
          }
        })
      )
    );

    return { updatedEvents: activeEvents.length, awardedPoints: delta };
  }

  async safeAwardActionPoints(playerId: string, actionType: EventActionType, quantity = 1) {
    try {
      return await this.awardActionPoints(playerId, actionType, quantity);
    } catch (error) {
      this.logger.warn(
        `Failed to award event points for player=${playerId}, action=${actionType}: ${
          error instanceof Error ? error.message : 'unknown error'
        }`
      );
      return { updatedEvents: 0, awardedPoints: 0 };
    }
  }
}
