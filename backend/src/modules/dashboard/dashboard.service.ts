import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationStatus, Prisma } from '@prisma/client';

const SUCCESS_STATUSES  = [NotificationStatus.NE_SUCCESS, NotificationStatus.NE_SENT] as const;
const FAILURE_STATUSES  = [NotificationStatus.NE_FAILED, NotificationStatus.NE_PARTIALLY_FAILED] as const;
const PENDING_STATUSES  = [NotificationStatus.NE_PENDING, NotificationStatus.NE_CREATED, NotificationStatus.NE_INITIALIZED] as const;
const INFLIGHT_STATUSES = [
  NotificationStatus.NE_PROCESSING, NotificationStatus.NE_UNDER_PROCESSING,
  NotificationStatus.NE_SENDING, NotificationStatus.NE_ROUTED,
  NotificationStatus.NE_RETRY, NotificationStatus.NE_PROCESSED,
] as const;

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const [statusGroups, queueResult] = await Promise.all([
      this.prisma.notification.groupBy({ by: ['status'], _count: { status: true } }),
      this.prisma.queue.aggregate({ _sum: { currentDepth: true } }),
    ]);

    const byStatus = Object.fromEntries(statusGroups.map(s => [s.status, s._count.status])) as Record<string, number>;
    const sum = (...keys: string[]) => keys.reduce((a, k) => a + (byStatus[k] ?? 0), 0);

    const success  = sum(...SUCCESS_STATUSES);
    const failure  = sum(...FAILURE_STATUSES);
    const pending  = sum(...PENDING_STATUSES);
    const inFlight = sum(...INFLIGHT_STATUSES);
    const total    = Object.values(byStatus).reduce((a, b) => a + b, 0);

    return {
      total,
      success,
      failure,
      pending,
      inFlight,
      successRate: total > 0 ? +((success / total) * 100).toFixed(1) : 0,
      failureRate: total > 0 ? +((failure / total) * 100).toFixed(1) : 0,
      queueDepth:  queueResult._sum.currentDepth ?? 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  async getCharts() {
    const now         = new Date();
    const sevenAgo    = new Date(now.getTime() - 7 * 86_400_000);

    const [trendRows, channelGroups, providers, successCount, failureCount, total] = await Promise.all([
      // Aggregate the 7-day trend in SQL (one row per day/status) instead of
      // loading every notification into Node — keeps memory flat at scale.
      this.prisma.$queryRaw<Array<{ day: Date; status: NotificationStatus; count: number }>>(Prisma.sql`
        SELECT date_trunc('day', "createdAt") AS day, status, COUNT(*)::int AS count
        FROM notifications
        WHERE "createdAt" >= ${sevenAgo}
        GROUP BY 1, 2
      `),
      this.prisma.notification.groupBy({ by: ['channel'], _count: { channel: true } }),
      this.prisma.provider.findMany({
        where:  { isEnabled: true },
        select: { name: true, channel: true, successRate: true, throughput: true },
        orderBy: { successRate: 'desc' },
      }),
      this.prisma.notification.count({ where: { status: { in: [...SUCCESS_STATUSES] } } }),
      this.prisma.notification.count({ where: { status: { in: [...FAILURE_STATUSES] } } }),
      this.prisma.notification.count(),
    ]);

    // Build 7-day trend buckets
    const buckets: Record<string, { date: string; success: number; failure: number; total: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d   = new Date(now.getTime() - i * 86_400_000);
      const key = d.toISOString().split('T')[0];
      buckets[key] = { date: key, success: 0, failure: 0, total: 0 };
    }
    for (const row of trendRows) {
      const key = new Date(row.day).toISOString().split('T')[0];
      const bucket = buckets[key];
      if (bucket) {
        bucket.total += row.count;
        if ((SUCCESS_STATUSES as readonly string[]).includes(row.status)) bucket.success += row.count;
        if ((FAILURE_STATUSES as readonly string[]).includes(row.status)) bucket.failure += row.count;
      }
    }

    return {
      trend: Object.values(buckets),
      channelDistribution: channelGroups.map(g => ({ channel: g.channel, count: g._count.channel })),
      providerDistribution: providers.map(p => ({ name: p.name, successRate: p.successRate, channel: p.channel })),
      successVsFailure: { success: successCount, failure: failureCount, other: total - successCount - failureCount },
    };
  }
}
