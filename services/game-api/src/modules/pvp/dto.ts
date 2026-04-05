import { IsUUID } from 'class-validator';

export class RaidDto {
  @IsUUID()
  attackerId!: string;

  @IsUUID()
  defenderId!: string;
}
