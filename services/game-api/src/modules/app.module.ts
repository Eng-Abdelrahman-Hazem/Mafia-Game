import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { PrismaService } from '../common/prisma.service';
import { AuthModule } from './auth/auth.module';
import { PlayerModule } from './player/player.module';
import { MissionModule } from './mission/mission.module';
import { PvpModule } from './pvp/pvp.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    AuthModule,
    PlayerModule,
    MissionModule,
    PvpModule
  ],
  providers: [PrismaService]
})
export class AppModule {}
