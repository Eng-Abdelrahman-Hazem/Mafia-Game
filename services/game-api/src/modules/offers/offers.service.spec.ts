import { BadRequestException } from '@nestjs/common';
import { OffersService } from './offers.service';

describe('OffersService', () => {
  const prisma = {
    offerConfig: { findMany: jest.fn(), upsert: jest.fn() }
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns active offers', async () => {
    const service = new OffersService(prisma);
    prisma.offerConfig.findMany.mockResolvedValue([{ key: 'starter_pack' }]);

    const result = await service.getActiveOffers();

    expect(result).toHaveLength(1);
    expect(prisma.offerConfig.findMany).toHaveBeenCalled();
  });

  it('rejects invalid offer windows', async () => {
    const service = new OffersService(prisma);

    await expect(
      service.upsertOffer({
        key: 'starter_pack',
        title: 'Starter Pack',
        priceUsd: 1.99,
        gemAmount: 200,
        startsAt: '2026-01-01T00:00:00.000Z',
        endsAt: '2026-01-01T00:00:00.000Z'
      })
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
