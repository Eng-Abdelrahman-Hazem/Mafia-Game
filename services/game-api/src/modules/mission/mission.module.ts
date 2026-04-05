import { Module } from '@nestjs/common';
import { MissionController } from './mission.controller';
import { MissionService } from './mission.service';
import { PrismaService } from '../../common/prisma.service';
import { AuthTokenService } from '../../common/auth-token.service';
import { PlayerAuthGuard } from '../../common/player-auth.guard';
import { LiveEventScoreService } from '../../common/live-event-score.service';

@Module({
  controllers: [MissionController],
  providers: [MissionService, PrismaService, AuthTokenService, PlayerAuthGuard, LiveEventScoreService]

@Module({
  controllers: [MissionController],
  providers: [MissionService, PrismaService]
})
export class MissionModule {}
