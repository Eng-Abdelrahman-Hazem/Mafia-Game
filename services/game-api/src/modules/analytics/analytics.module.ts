import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../../common/prisma.service';
import { AdminGuard } from '../../common/admin/admin.guard';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, PrismaService, AdminGuard]
})
export class AnalyticsModule {}
