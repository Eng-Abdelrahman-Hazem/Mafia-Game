import { IsEnum, IsInt, IsUUID, Min } from 'class-validator';

export enum ResourceKey {
  CASH = 'cash',
  GEMS = 'gems',
  ENERGY = 'energy',
  INFLUENCE = 'influence',
  CONTRABAND = 'contraband',
  LOYALTY = 'loyalty'
}

export class GrantResourceDto {
  @IsUUID()
  playerId!: string;

  @IsEnum(ResourceKey)
  resource!: ResourceKey;

  @IsInt()
  @Min(1)
  amount!: number;
}
