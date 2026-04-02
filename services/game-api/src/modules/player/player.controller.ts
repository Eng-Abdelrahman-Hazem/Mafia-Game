import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { PlayerService } from './player.service';
import { GrantResourceDto } from './dto';
import { PlayerAuthGuard } from '../../common/player-auth.guard';
import { CurrentPlayerId } from '../../common/current-player.decorator';

@Controller('players')
@UseGuards(PlayerAuthGuard)
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get('me')
  async getPlayer(@CurrentPlayerId() playerId: string) {
    return this.playerService.getProfile(playerId);
  }

  @Patch('grant-resource')
  async grantResource(@CurrentPlayerId() playerId: string, @Body() input: GrantResourceDto) {
    return this.playerService.grantResource(playerId, input);
  }
}
