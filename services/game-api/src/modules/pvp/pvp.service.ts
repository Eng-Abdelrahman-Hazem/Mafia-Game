import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RaidDto } from './dto';
import { RandomService } from '../../common/random.service';

const MAX_DAILY_STEAL = 5000;
const SHIELD_MINUTES_AFTER_LOSS = 20;

@Injectable()
export class PvpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly randomService: RandomService
  ) {}

  async runRaid(attackerId: string, input: RaidDto) {
    if (attackerId === input.defenderId) {
      throw new BadRequestException('Cannot raid self');
    }

    const [attacker, defender] = await Promise.all([
      this.prisma.player.findUnique({ where: { id: attackerId }, include: { resources: true } }),
      this.prisma.player.findUnique({ where: { id: input.defenderId }, include: { resources: true } })
    ]);

    if (!attacker?.resources || !defender?.resources) {
      throw new BadRequestException('Invalid raid request');
    }

    const protection = await this.prisma.pvPProtectionState.findUnique({
      where: { playerId: defender.id }
    });

    if (protection?.shieldUntil && protection.shieldUntil > new Date()) {
      throw new BadRequestException('Target is shielded');
    }

    const powerDelta = attacker.powerRating - defender.powerRating;
    const winChance = Math.max(0.15, Math.min(0.85, 0.5 + powerDelta / 4000));
    const won = this.randomService.next() <= winChance;

    const potentialSteal = Math.min(defender.resources.cash, 1000);
    const stolenCash = won ? Math.min(potentialSteal, MAX_DAILY_STEAL) : 0;

    await this.prisma.$transaction(async (tx) => {
      if (stolenCash > 0) {
        await tx.playerResource.update({
          where: { playerId: attacker.id },
          data: { cash: { increment: stolenCash }, influence: { increment: 3 } }
        });

        await tx.playerResource.update({
          where: { playerId: defender.id },
          data: { cash: { decrement: stolenCash } }
        });
      }

      await tx.pvPRaidLog.create({
        data: {
          attackerId: attacker.id,
          defenderId: defender.id,
          won,
          stolenCash,
          attackerPower: attacker.powerRating,
          defenderPower: defender.powerRating
        }
      });

      if (won) {
        const shieldUntil = new Date(Date.now() + SHIELD_MINUTES_AFTER_LOSS * 60 * 1000);
        await tx.pvPProtectionState.upsert({
          where: { playerId: defender.id },
          update: {
            lastRaidedAt: new Date(),
            raidsAgainstWindow: { increment: 1 },
            shieldUntil
          },
          create: {
            playerId: defender.id,
            lastRaidedAt: new Date(),
            raidsAgainstWindow: 1,
            shieldUntil
          }
        });
      }
    });

    return { won, stolenCash, winChance };
  }

  async getRaidTargets(attackerId: string) {
    return this.prisma.player.findMany({
      where: {
        isBot: true,
        NOT: { id: attackerId }
      },
      include: { resources: true },
      take: 10,
      orderBy: { powerRating: 'asc' }
    });
  }
}
