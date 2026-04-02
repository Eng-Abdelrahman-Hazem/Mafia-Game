import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { GrantResourceDto } from './dto';

@Injectable()
export class PlayerService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(playerId: string) {
    const player = await this.prisma.player.findUnique({
      where: { id: playerId },
      include: { resources: true }
    });

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    return player;
  }

  async grantResource(playerId: string, input: GrantResourceDto) {
    const profile = await this.getProfile(playerId);
    const current = profile.resources;

    if (!current) {
      throw new BadRequestException('Player resources missing');
    }

    const updated = await this.prisma.playerResource.update({
      where: { playerId },
      data: { [input.resource]: current[input.resource] + input.amount }
    });

    return updated;
  }
}
