import { IsUUID } from 'class-validator';

export class RaidDto {
  @IsUUID()
  defenderId!: string;
}
