import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { GuestLoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async guestLogin(input: GuestLoginDto) {
    const existing = await this.prisma.player.findUnique({
      where: { deviceId: input.deviceId },
      include: { resources: true }
    });

    if (existing) {
      return { player: existing, isNew: false };
    }

    const player = await this.prisma.player.create({
      data: {
        deviceId: input.deviceId,
        handle: input.preferredHandle ?? `Rookie_${Math.floor(Math.random() * 100000)}`,
        faction: 'DOCK_SERPENTS',
        resources: {
          create: {
            cash: 2500,
            gems: 100,
            energy: 40,
            influence: 0,
            contraband: 0,
            loyalty: 100,
            heat: 0
          }
        }
      },
      include: { resources: true }
    });

    return { player, isNew: true };
  }
}
