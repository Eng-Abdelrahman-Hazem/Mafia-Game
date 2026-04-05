import { Module } from '@nestjs/common';
import { PvpController } from './pvp.controller';
import { PvpService } from './pvp.service';
import { PrismaService } from '../../common/prisma.service';
import { RandomService } from '../../common/random.service';
import { AuthTokenService } from '../../common/auth-token.service';
import { PlayerAuthGuard } from '../../common/player-auth.guard';
import { LiveEventScoreService } from '../../common/live-event-score.service';

@Module({
  controllers: [PvpController],
  providers: [PvpService, PrismaService, RandomService, AuthTokenService, PlayerAuthGuard, LiveEventScoreService]

@Module({
  controllers: [PvpController],
  providers: [PvpService, PrismaService]
})
export class PvpModule {}
