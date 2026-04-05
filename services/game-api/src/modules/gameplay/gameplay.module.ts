import { Module } from '@nestjs/common';
import { GameplayController } from './gameplay.controller';
import { GameplayService } from './gameplay.service';
import { PrismaService } from '../../common/prisma.service';
import { AuthTokenService } from '../../common/auth-token.service';
import { PlayerAuthGuard } from '../../common/player-auth.guard';
import { LiveEventScoreService } from '../../common/live-event-score.service';

@Module({
  controllers: [GameplayController],
  providers: [GameplayService, PrismaService, AuthTokenService, PlayerAuthGuard, LiveEventScoreService]
})
export class GameplayModule {}
