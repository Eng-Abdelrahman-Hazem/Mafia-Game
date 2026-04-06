import { IsBoolean, IsDateString, IsInt, IsNumber, IsObject, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpsertOfferDto {
  @IsString()
  key!: string;

  @IsString()
  title!: string;

  @IsNumber()
  @Min(0.01)
  priceUsd!: number;

  @IsInt()
  @Min(1)
  gemAmount!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(500)
  bonusPct?: number;

  @IsDateString()
  startsAt!: string;

  @IsDateString()
  endsAt!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsObject()
  targeting?: Record<string, unknown>;
}
