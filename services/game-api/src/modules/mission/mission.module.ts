import { Module } from '@nestjs/common';
import { MissionController } from './mission.controller';
import { MissionService } from './mission.service';
import { PrismaService } from '../../common/prisma.service';
import { AuthTokenService } from '../../common/auth-token.service';
import { PlayerAuthGuard } from '../../common/player-auth.guard';

@Module({
  controllers: [MissionController],
  providers: [MissionService, PrismaService, AuthTokenService, PlayerAuthGuard]
})
export class MissionModule {}
