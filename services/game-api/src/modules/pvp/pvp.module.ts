import { Module } from '@nestjs/common';
import { PvpController } from './pvp.controller';
import { PvpService } from './pvp.service';
import { PrismaService } from '../../common/prisma.service';

@Module({
  controllers: [PvpController],
  providers: [PvpService, PrismaService]
})
export class PvpModule {}
