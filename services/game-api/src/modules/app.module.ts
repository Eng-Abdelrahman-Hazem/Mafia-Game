import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { PrismaService } from '../common/prisma.service';
import { AuthTokenService } from '../common/auth-token.service';
import { RandomService } from '../common/random.service';
import { AuthModule } from './auth/auth.module';
import { PlayerModule } from './player/player.module';
import { MissionModule } from './mission/mission.module';
import { PvpModule } from './pvp/pvp.module';
import { GameplayModule } from './gameplay/gameplay.module';
import { WorkerModule } from './worker/worker.module';
import { EventsModule } from './events/events.module';
import { OffersModule } from './offers/offers.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    AuthModule,
    PlayerModule,
    MissionModule,
    PvpModule,
    GameplayModule,
    WorkerModule,
    EventsModule,
    OffersModule,
    AnalyticsModule
  ],
  providers: [PrismaService, AuthTokenService, RandomService]
})
export class AppModule {}
