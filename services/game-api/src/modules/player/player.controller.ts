import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { PlayerService } from './player.service';
import { GrantResourceDto } from './dto';
import { PlayerAuthGuard } from '../../common/player-auth.guard';
import { CurrentPlayerId } from '../../common/current-player.decorator';
import { AdminGuard } from '../../common/admin/admin.guard';
import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { PlayerService } from './player.service';
import { GrantResourceDto } from './dto';

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
  @Get(':id')
  async getPlayer(@Param('id') id: string) {
    return this.playerService.getProfile(id);
  }

  @Patch('grant-resource')
  async grantResource(@Body() input: GrantResourceDto) {
    return this.playerService.grantResource(input);
  }
}
