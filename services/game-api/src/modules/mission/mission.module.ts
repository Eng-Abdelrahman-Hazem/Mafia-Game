import { Module } from '@nestjs/common';
import { MissionController } from './mission.controller';
import { MissionService } from './mission.service';
import { PrismaService } from '../../common/prisma.service';

@Module({
  controllers: [MissionController],
  providers: [MissionService, PrismaService]
})
export class MissionModule {}
