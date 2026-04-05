import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

export class GuestLoginDto {
  @IsString()
  @Length(8, 128)
  deviceId!: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z0-9_]{3,20}$/)
  preferredHandle?: string;
}

export class BindEmailDto {
  @IsEmail()
  email!: string;
}
