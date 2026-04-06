import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BindEmailDto, GuestLoginDto } from './dto';
import { PlayerAuthGuard } from '../../common/player-auth.guard';
import { CurrentPlayerId } from '../../common/current-player.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('guest-login')
  async guestLogin(@Body() input: GuestLoginDto) {
    return this.authService.guestLogin(input);
  }

  @Post('bind-email')
  @UseGuards(PlayerAuthGuard)
  async bindEmail(@CurrentPlayerId() playerId: string, @Body() input: BindEmailDto) {
    return this.authService.bindEmail(playerId, input);
  }
}
