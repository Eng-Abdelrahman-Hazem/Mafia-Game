import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { PlayerAuthGuard } from '../../common/player-auth.guard';
import { AdminGuard } from '../../common/admin/admin.guard';
import { UpsertOfferDto } from './dto';

@Controller('offers')
@UseGuards(PlayerAuthGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get('active')
  async active() {
    return this.offersService.getActiveOffers();
  }
}

@Controller('internal/offers')
@UseGuards(AdminGuard)
export class InternalOffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post('upsert')
  async upsert(@Body() input: UpsertOfferDto) {
    return this.offersService.upsertOffer(input);
  }
}
