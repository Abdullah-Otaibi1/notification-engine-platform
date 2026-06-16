import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Channel } from '@prisma/client';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  async getHealth() {
    const channels = Object.values(Channel);

    const results = await Promise.all(
      channels.map(async (ch) => {
        const providers = await this.prisma.provider.findMany({
          where: { channel: ch },
          select: { name: true, status: true, successRate: true, failureRate: true, avgLatencyMs: true, throughput: true, isEnabled: true },
        });

        if (providers.length === 0) {
          return { channel: ch, status: 'HEALTHY', throughput: 0, errorRate: 0, avgLatencyMs: 0, providerCount: 0 };
        }

        const enabled = providers.filter(p => p.isEnabled);
        const avgSuccess  = enabled.reduce((a, p) => a + p.successRate,  0) / (enabled.length || 1);
        const avgLatency  = enabled.reduce((a, p) => a + p.avgLatencyMs, 0) / (enabled.length || 1);
        const totalThroughput = enabled.reduce((a, p) => a + p.throughput, 0);

        const downCount     = providers.filter(p => p.status === 'DOWN').length;
        const degradedCount = providers.filter(p => p.status === 'DEGRADED').length;
        let channelStatus   = 'HEALTHY';
        if (downCount > 0 || avgSuccess < 90)     channelStatus = 'DOWN';
        else if (degradedCount > 0 || avgSuccess < 96) channelStatus = 'DEGRADED';

        return {
          channel:      ch,
          status:       channelStatus,
          throughput:   Math.round(totalThroughput),
          errorRate:    +(100 - avgSuccess).toFixed(1),
          avgLatencyMs: Math.round(avgLatency),
          providerCount: providers.length,
          providers:    providers.map(p => ({ name: p.name, status: p.status, isEnabled: p.isEnabled })),
        };
      }),
    );

    return results;
  }
}
