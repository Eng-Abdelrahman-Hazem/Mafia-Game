import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AdminGuard } from '../../common/admin/admin.guard';
import { EmailBindFunnelQueryDto } from './dto';

@Controller('internal/analytics')
@UseGuards(AdminGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('email-bind-funnel')
  async emailBindFunnel(@Query() query: EmailBindFunnelQueryDto) {
    return this.analyticsService.getEmailBindFunnel(query.days);
  }
}
