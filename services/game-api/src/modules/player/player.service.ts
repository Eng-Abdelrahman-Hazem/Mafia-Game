import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { GrantResourceDto } from './dto';
import { AdminAuditService } from '../admin/admin-audit.service';

@Injectable()
export class PlayerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly adminAuditService: AdminAuditService
  ) {}

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
  async grantResource(input: GrantResourceDto) {
    const profile = await this.getProfile(input.playerId);
    const current = profile.resources;

    if (!current) {
      throw new BadRequestException('Player resources missing');
    }

    const updated = await this.prisma.playerResource.update({
      where: { playerId },
      data: { [input.resource]: current[input.resource] + input.amount }
    });

    await this.adminAuditService.record('admin-api', 'grant-resource', playerId, {
      resource: input.resource,
      amount: input.amount
    });

      where: { playerId: input.playerId },
      data: { [input.resource]: current[input.resource] + input.amount }
    });

    return updated;
  }
}
