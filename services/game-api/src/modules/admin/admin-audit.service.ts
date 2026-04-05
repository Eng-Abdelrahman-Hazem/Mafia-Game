import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AdminAuditService {
  constructor(private readonly prisma: PrismaService) {}

  async record(actor: string, action: string, playerId: string, payload?: Record<string, unknown>) {
    await this.prisma.adminAuditLog.create({
      data: {
        actor,
        action,
        playerId,
        payload
      }
    });
  }
}
