import { Module } from '@nestjs/common';
import { PvpController } from './pvp.controller';
import { PvpService } from './pvp.service';
import { PrismaService } from '../../common/prisma.service';
import { RandomService } from '../../common/random.service';
import { AuthTokenService } from '../../common/auth-token.service';
import { PlayerAuthGuard } from '../../common/player-auth.guard';

@Module({
  controllers: [PvpController],
  providers: [PvpService, PrismaService, RandomService, AuthTokenService, PlayerAuthGuard]
})
export class PvpModule {}
