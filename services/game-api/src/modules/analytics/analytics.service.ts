import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getEmailBindFunnel(days = 14) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [newPlayers, boundPlayers, bindEvents] = await Promise.all([
      this.prisma.player.count({ where: { createdAt: { gte: since }, isBot: false } }),
      this.prisma.player.count({
        where: {
          createdAt: { gte: since },
          isBot: false,
          emailBoundAt: { not: null }
        }
      }),
      this.prisma.analyticsEvent.count({
        where: {
          eventName: 'auth_email_bound',
          createdAt: { gte: since }
        }
      })
    ]);

    const conversionRate = newPlayers === 0 ? 0 : Number(((boundPlayers / newPlayers) * 100).toFixed(2));

    return {
      days,
      newPlayers,
      boundPlayers,
      bindEvents,
      conversionRate
    };
  }
}
