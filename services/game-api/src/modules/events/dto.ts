import { IsIn, IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';

const ALLOWED_ACTIONS = ['crime_complete', 'raid_win', 'daily_login', 'syndicate_donation'] as const;

export class AddEventScoreDto {
  @IsIn(ALLOWED_ACTIONS)
  actionType!: (typeof ALLOWED_ACTIONS)[number];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  quantity?: number;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  @Matches(/^[a-zA-Z0-9._:-]+$/)
  idempotencyKey?: string;
}

export class LeaderboardQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class SnapshotQueryDto {
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(500)
  top?: number;
}

export class SettleRewardsQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  top?: number;
}
