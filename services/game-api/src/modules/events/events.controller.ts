import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { PlayerAuthGuard } from '../../common/player-auth.guard';
import { CurrentPlayerId } from '../../common/current-player.decorator';
import { AddEventScoreDto } from './dto';

@Controller('events')
@UseGuards(PlayerAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('active')
  async getActive(@CurrentPlayerId() playerId: string) {
    return this.eventsService.getActiveEvents(playerId);
  }

  @Post(':eventId/score')
  async score(
    @CurrentPlayerId() playerId: string,
    @Param('eventId') eventId: string,
    @Body() input: AddEventScoreDto
  ) {
    return this.eventsService.addScore(playerId, eventId, input);
  }

  @Post(':eventId/claim')
  async claim(@CurrentPlayerId() playerId: string, @Param('eventId') eventId: string) {
    return this.eventsService.claimEventReward(playerId, eventId);
  }
}
