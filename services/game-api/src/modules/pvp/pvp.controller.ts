import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PvpService } from './pvp.service';
import { RaidDto } from './dto';
import { PlayerAuthGuard } from '../../common/player-auth.guard';
import { CurrentPlayerId } from '../../common/current-player.decorator';

@Controller('pvp')
@UseGuards(PlayerAuthGuard)
export class PvpController {
  constructor(private readonly pvpService: PvpService) {}

  @Get('targets')
  async targets(@CurrentPlayerId() attackerId: string) {
    return this.pvpService.getRaidTargets(attackerId);
  }

  @Post('raid')
  async raid(@CurrentPlayerId() attackerId: string, @Body() input: RaidDto) {
    return this.pvpService.runRaid(attackerId, input);
  }
}
