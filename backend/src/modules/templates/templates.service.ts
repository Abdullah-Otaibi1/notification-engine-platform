import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { channel?: string; isEnabled?: string; page?: number; pageSize?: number }) {
    const page     = Math.max(1, query.page     ?? 1);
    const pageSize = Math.min(100, query.pageSize ?? 50);
    const skip     = (page - 1) * pageSize;

    const where: any = {};
    if (query.channel)   where.channel   = query.channel;
    if (query.isEnabled !== undefined) where.isEnabled = query.isEnabled === 'true';

    const [items, total] = await Promise.all([
      this.prisma.notificationTemplate.findMany({
        where, skip, take: pageSize,
        orderBy: [{ channel: 'asc' }, { templateCode: 'asc' }],
      }),
      this.prisma.notificationTemplate.count({ where }),
    ]);

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string) {
    return this.prisma.notificationTemplate.findUniqueOrThrow({ where: { id } });
  }
}
