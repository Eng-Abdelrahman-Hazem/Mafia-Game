import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { PlayerService } from './player.service';
import { GrantResourceDto } from './dto';
import { PlayerAuthGuard } from '../../common/player-auth.guard';
import { CurrentPlayerId } from '../../common/current-player.decorator';
import { AdminGuard } from '../../common/admin/admin.guard';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get('me')
  @UseGuards(PlayerAuthGuard)
  async getPlayer(@CurrentPlayerId() playerId: string) {
    return this.playerService.getProfile(playerId);
  }

  @Patch('grant-resource')
  @UseGuards(AdminGuard)
  async grantResource(@Body() input: GrantResourceDto) {
    return this.playerService.grantResource(input.playerId, input);
  }
}
