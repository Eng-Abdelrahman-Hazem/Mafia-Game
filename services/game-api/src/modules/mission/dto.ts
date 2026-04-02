import { IsUUID } from 'class-validator';

export class StartMissionDto {
  @IsUUID()
  playerId!: string;

  @IsUUID()
  missionTemplateId!: string;
}
