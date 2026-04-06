import { IsUUID } from 'class-validator';

export class StartMissionDto {
  @IsUUID()
  missionTemplateId!: string;
}
