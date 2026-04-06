import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { AdminGuard } from '../../common/admin/admin.guard';

@Controller('internal/worker')
@UseGuards(AdminGuard)
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Post('process-missions')
  async processMissions(@Query('limit') limit?: string) {
    return this.workerService.processMissionPayouts(limit ? Number(limit) : 50);
  }
}
