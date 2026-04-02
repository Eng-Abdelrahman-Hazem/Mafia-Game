import { Body, Controller, Get, Post } from '@nestjs/common';
import { MissionService } from './mission.service';
import { StartMissionDto } from './dto';

@Controller('missions')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get('templates')
  async listTemplates() {
    return this.missionService.listTemplates();
  }

  @Post('start')
  async start(@Body() input: StartMissionDto) {
    return this.missionService.startMission(input);
  }
}
