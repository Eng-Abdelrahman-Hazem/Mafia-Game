import { Body, Controller, Post } from '@nestjs/common';
import { PvpService } from './pvp.service';
import { RaidDto } from './dto';

@Controller('pvp')
export class PvpController {
  constructor(private readonly pvpService: PvpService) {}

  @Post('raid')
  async raid(@Body() input: RaidDto) {
    return this.pvpService.runRaid(input);
  }
}
