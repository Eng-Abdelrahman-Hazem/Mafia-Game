import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../../common/prisma.service';
import { AuthTokenService } from '../../common/auth-token.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, AuthTokenService]
})
export class AuthModule {}
