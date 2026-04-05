import { Controller, Param, Post, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { AdminGuard } from '../../common/admin/admin.guard';
import { SnapshotQueryDto } from './dto';

@Controller('internal/events')
@UseGuards(AdminGuard)
export class InternalEventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post(':eventId/snapshot')
  async snapshot(@Param('eventId') eventId: string, @Query() query: SnapshotQueryDto) {
    return this.eventsService.snapshotLeaderboard(eventId, query.top);
  }
}
