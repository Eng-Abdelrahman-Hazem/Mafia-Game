import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../../common/prisma.service';
import { AuthTokenService } from '../../common/auth-token.service';
import { PlayerAuthGuard } from '../../common/player-auth.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, AuthTokenService, PlayerAuthGuard]

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService]
})
export class AuthModule {}
