import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';
import { AddEventScoreDto } from './dto';
import { ACTION_POINTS } from '../../common/live-event-score.service';

type RewardTier = {
  minPoints: number;
  cash?: number;
  influence?: number;
  gems?: number;
};

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveEvents(playerId: string) {
    const now = new Date();
    const events = await this.prisma.liveEvent.findMany({
      where: {
        startsAt: { lte: now },
        endsAt: { gt: now },
        template: { isActive: true }
      },
      include: {
        template: true,
        playerScores: {
          where: { playerId },
          take: 1
        }
      },
      orderBy: { endsAt: 'asc' }
    });

    return events.map((event: { id: string; endsAt: Date; template: { key: string; title: string; type: string }; playerScores: Array<{ points: number; claimedAt: Date | null }> }) => {
      const score = event.playerScores[0];
      return {
        id: event.id,
        key: event.template.key,
        title: event.template.title,
        type: event.template.type,
        endsAt: event.endsAt,
        points: score?.points ?? 0,
        claimed: Boolean(score?.claimedAt)
      };
    });
  }

  async addScore(playerId: string, eventId: string, input: AddEventScoreDto) {
    const event = await this.prisma.liveEvent.findUnique({
      where: { id: eventId },
      include: { template: true }
    });

    if (!event || !event.template.isActive) {
      throw new NotFoundException('Event not found');
    }

    const now = new Date();
    if (event.startsAt > now || event.endsAt <= now) {
      throw new BadRequestException('Event is not active');
    }

    const basePoints = ACTION_POINTS[input.actionType] ?? 0;
    if (basePoints === 0) {
      throw new BadRequestException('Unsupported action type');
    }

    const quantity = input.quantity ?? 1;
    const delta = basePoints * quantity;

    const score = await this.prisma.playerEventScore.upsert({
      where: {
        liveEventId_playerId: {
          liveEventId: eventId,
          playerId
        }
      },
      update: {
        points: { increment: delta }
      },
      create: {
        liveEventId: eventId,
        playerId,
        points: delta
      }
    });

    return {
      eventId,
      delta,
      points: score.points
    };
  }

  async claimEventReward(playerId: string, eventId: string) {
    const now = new Date();

    const event = await this.prisma.liveEvent.findUnique({
      where: { id: eventId },
      include: { template: true }
    });

    if (!event || !event.template.isActive) {
      throw new NotFoundException('Event not found');
    }

    if (event.startsAt > now || event.endsAt <= now) {
      throw new BadRequestException('Event is not active');
    }

    const rewards = this.parseRewards(event.template.rewards);

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const score = await tx.playerEventScore.findUnique({
        where: {
          liveEventId_playerId: {
            liveEventId: eventId,
            playerId
          }
        }
      });

      if (!score) {
        throw new BadRequestException('No event progress found');
      }

      if (score.claimedAt) {
        throw new BadRequestException('Reward already claimed');
      }

      const tier = this.selectTier(score.points, rewards);
      if (!tier) {
        throw new BadRequestException('Not enough points for reward');
      }

      await tx.playerResource.update({
        where: { playerId },
        data: {
          cash: { increment: tier.cash ?? 0 },
          influence: { increment: tier.influence ?? 0 },
          gems: { increment: tier.gems ?? 0 }
        }
      });

      await tx.playerEventScore.update({
        where: {
          liveEventId_playerId: {
            liveEventId: eventId,
            playerId
          }
        },
        data: { claimedAt: new Date() }
      });

      return {
        claimed: true,
        reward: tier
      };
    });
  }

  private parseRewards(rawRewards: unknown): RewardTier[] {
    if (!Array.isArray(rawRewards)) {
      throw new BadRequestException('Invalid reward configuration');
    }

    return rawRewards
      .filter((value): value is RewardTier => typeof value === 'object' && value !== null)
      .map((value) => ({
        minPoints: Number(value.minPoints ?? 0),
        cash: Number(value.cash ?? 0),
        influence: Number(value.influence ?? 0),
        gems: Number(value.gems ?? 0)
      }))
      .sort((a, b) => b.minPoints - a.minPoints);
  }

  private selectTier(points: number, tiers: RewardTier[]) {
    return tiers.find((tier) => points >= tier.minPoints);
  }
}
