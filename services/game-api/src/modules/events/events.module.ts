import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { InternalEventsController } from './internal-events.controller';
import { EventsService } from './events.service';
import { PrismaService } from '../../common/prisma.service';
import { AuthTokenService } from '../../common/auth-token.service';
import { PlayerAuthGuard } from '../../common/player-auth.guard';
import { AdminGuard } from '../../common/admin/admin.guard';

@Module({
  controllers: [EventsController, InternalEventsController],
  providers: [EventsService, PrismaService, AuthTokenService, PlayerAuthGuard, AdminGuard]
})
export class EventsModule {}
