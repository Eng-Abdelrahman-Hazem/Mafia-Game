import { Module } from '@nestjs/common';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';
import { PrismaService } from '../../common/prisma.service';
import { AdminGuard } from '../../common/admin/admin.guard';
import { LiveEventScoreService } from '../../common/live-event-score.service';

@Module({
  controllers: [WorkerController],
  providers: [WorkerService, PrismaService, AdminGuard, LiveEventScoreService]
})
export class WorkerModule {}
