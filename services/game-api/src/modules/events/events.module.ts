import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaService } from '../../common/prisma.service';
import { AuthTokenService } from '../../common/auth-token.service';
import { PlayerAuthGuard } from '../../common/player-auth.guard';

@Module({
  controllers: [EventsController],
  providers: [EventsService, PrismaService, AuthTokenService, PlayerAuthGuard]
})
export class EventsModule {}
