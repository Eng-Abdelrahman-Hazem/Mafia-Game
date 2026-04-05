import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

const ALLOWED_ACTIONS = ['crime_complete', 'raid_win', 'daily_login', 'syndicate_donation'] as const;

export class AddEventScoreDto {
  @IsIn(ALLOWED_ACTIONS)
  actionType!: (typeof ALLOWED_ACTIONS)[number];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  quantity?: number;
}
