import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';
import { BindEmailDto, GuestLoginDto } from './dto';
import { AuthTokenService } from '../../common/auth-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authTokenService: AuthTokenService
  ) {}

  async guestLogin(input: GuestLoginDto) {
    const existing = await this.prisma.player.findUnique({
      where: { deviceId: input.deviceId },
      include: { resources: true }
    });

    if (existing) {
      return {
        player: existing,
        isNew: false,
        accessToken: this.authTokenService.issueToken(existing.id)
      };
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

    return { player, isNew: true, accessToken: this.authTokenService.issueToken(player.id) };
  }

  async bindEmail(playerId: string, input: BindEmailDto) {
    const normalizedEmail = input.email.trim().toLowerCase();

    const existing = await this.prisma.player.findUnique({
      where: { email: normalizedEmail }
    });

    if (existing && existing.id !== playerId) {
      throw new BadRequestException('Email is already bound to another account');
    }

    const now = new Date();
    const updated = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const player = await tx.player.update({
        where: { id: playerId },
        data: {
          email: normalizedEmail,
          emailBoundAt: now
        },
        select: {
          id: true,
          handle: true,
          email: true,
          emailBoundAt: true
        }
      });

      await tx.analyticsEvent.create({
        data: {
          playerId,
          eventName: 'auth_email_bound',
          payload: { method: 'manual_bind', emailDomain: normalizedEmail.split('@')[1] ?? 'unknown' }
        }
      });

      return player;
    });

    return {
      bound: true,
      player: updated
    };
  }
}
