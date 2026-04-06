import { Module } from '@nestjs/common';
import { OffersController, InternalOffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { PrismaService } from '../../common/prisma.service';
import { PlayerAuthGuard } from '../../common/player-auth.guard';
import { AuthTokenService } from '../../common/auth-token.service';
import { AdminGuard } from '../../common/admin/admin.guard';

@Module({
  controllers: [OffersController, InternalOffersController],
  providers: [OffersService, PrismaService, PlayerAuthGuard, AuthTokenService, AdminGuard]
})
export class OffersModule {}
