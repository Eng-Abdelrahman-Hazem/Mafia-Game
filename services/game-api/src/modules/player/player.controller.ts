import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { PlayerService } from './player.service';
import { GrantResourceDto } from './dto';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get(':id')
  async getPlayer(@Param('id') id: string) {
    return this.playerService.getProfile(id);
  }

  @Patch('grant-resource')
  async grantResource(@Body() input: GrantResourceDto) {
    return this.playerService.grantResource(input);
  }
}
