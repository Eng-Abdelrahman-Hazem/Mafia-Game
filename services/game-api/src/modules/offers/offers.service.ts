import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { UpsertOfferDto } from './dto';

@Injectable()
export class OffersService {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveOffers() {
    const now = new Date();
    return this.prisma.offerConfig.findMany({
      where: {
        isActive: true,
        startsAt: { lte: now },
        endsAt: { gt: now }
      },
      orderBy: { startsAt: 'asc' }
    });
  }

  async upsertOffer(input: UpsertOfferDto) {
    const startsAt = new Date(input.startsAt);
    const endsAt = new Date(input.endsAt);

    if (endsAt <= startsAt) {
      throw new BadRequestException('endsAt must be after startsAt');
    }

    return this.prisma.offerConfig.upsert({
      where: { key: input.key },
      update: {
        title: input.title,
        priceUsd: input.priceUsd,
        gemAmount: input.gemAmount,
        bonusPct: input.bonusPct ?? 0,
        startsAt,
        endsAt,
        isActive: input.isActive ?? true,
        targeting: input.targeting ?? null
      },
      create: {
        key: input.key,
        title: input.title,
        priceUsd: input.priceUsd,
        gemAmount: input.gemAmount,
        bonusPct: input.bonusPct ?? 0,
        startsAt,
        endsAt,
        isActive: input.isActive ?? true,
        targeting: input.targeting ?? null
      }
    });
  }
}
