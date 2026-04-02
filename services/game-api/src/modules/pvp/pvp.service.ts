import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RaidDto } from './dto';

const MAX_DAILY_STEAL = 5000;

@Injectable()
export class PvpService {
  constructor(private readonly prisma: PrismaService) {}

  async runRaid(input: RaidDto) {
    if (input.attackerId === input.defenderId) {
      throw new BadRequestException('Cannot raid self');
    }

    const [attacker, defender] = await Promise.all([
      this.prisma.player.findUnique({ where: { id: input.attackerId }, include: { resources: true } }),
      this.prisma.player.findUnique({ where: { id: input.defenderId }, include: { resources: true } })
    ]);

    if (!attacker?.resources || !defender?.resources) {
      throw new BadRequestException('Invalid raid request');
    }

    const powerDelta = attacker.powerRating - defender.powerRating;
    const winChance = Math.max(0.15, Math.min(0.85, 0.5 + powerDelta / 4000));
    const won = Math.random() <= winChance;

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
    });

    return { won, stolenCash, winChance };
  }
}
