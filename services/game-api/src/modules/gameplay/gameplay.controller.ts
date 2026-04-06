import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GameplayService } from './gameplay.service';
import { PlayerAuthGuard } from '../../common/player-auth.guard';
import { CurrentPlayerId } from '../../common/current-player.decorator';
import { InstantCrimeDto } from './dto';

@Controller('gameplay')
@UseGuards(PlayerAuthGuard)
export class GameplayController {
  constructor(private readonly gameplayService: GameplayService) {}

  @Get('home')
  async home(@CurrentPlayerId() playerId: string) {
    return this.gameplayService.getHome(playerId);
  }

  @Post('crime/instant')
  async instantCrime(@CurrentPlayerId() playerId: string, @Body() input: InstantCrimeDto) {
    return this.gameplayService.instantCrime(playerId, input.missionTemplateId);
  }
}
