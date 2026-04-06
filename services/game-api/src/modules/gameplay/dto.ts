import { IsUUID } from 'class-validator';

export class InstantCrimeDto {
  @IsUUID()
  missionTemplateId!: string;
}
