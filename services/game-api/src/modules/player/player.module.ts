import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { PrismaService } from '../../common/prisma.service';
import { AuthTokenService } from '../../common/auth-token.service';
import { PlayerAuthGuard } from '../../common/player-auth.guard';
import { AdminGuard } from '../../common/admin/admin.guard';
import { AdminAuditService } from '../admin/admin-audit.service';

@Module({
  controllers: [PlayerController],
  providers: [PlayerService, PrismaService, AuthTokenService, PlayerAuthGuard, AdminGuard, AdminAuditService]
})
export class PlayerModule {}
