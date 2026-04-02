import { Module } from '@nestjs/common';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';
import { PrismaService } from '../../common/prisma.service';
import { AdminGuard } from '../../common/admin/admin.guard';

@Module({
  controllers: [WorkerController],
  providers: [WorkerService, PrismaService, AdminGuard]
})
export class WorkerModule {}
