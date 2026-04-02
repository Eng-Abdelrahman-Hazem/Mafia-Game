import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MissionService } from './mission.service';
import { StartMissionDto } from './dto';
import { PlayerAuthGuard } from '../../common/player-auth.guard';
import { CurrentPlayerId } from '../../common/current-player.decorator';

@Controller('missions')
@UseGuards(PlayerAuthGuard)
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get('templates')
  async listTemplates() {
    return this.missionService.listTemplates();
  }

  @Post('start')
  async start(@CurrentPlayerId() playerId: string, @Body() input: StartMissionDto) {
    return this.missionService.startMission(playerId, input);
  }

  @Post(':runId/claim')
  async claim(@CurrentPlayerId() playerId: string, @Param('runId') runId: string) {
    return this.missionService.claimMission(playerId, runId);
  }
}
