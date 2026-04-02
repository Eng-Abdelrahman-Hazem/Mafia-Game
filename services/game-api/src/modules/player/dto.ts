import { IsEnum, IsInt, Min } from 'class-validator';

export enum ResourceKey {
  CASH = 'cash',
  GEMS = 'gems',
  ENERGY = 'energy',
  INFLUENCE = 'influence',
  CONTRABAND = 'contraband',
  LOYALTY = 'loyalty'
}

export class GrantResourceDto {
  @IsEnum(ResourceKey)
  resource!: ResourceKey;

  @IsInt()
  @Min(1)
  amount!: number;
}
