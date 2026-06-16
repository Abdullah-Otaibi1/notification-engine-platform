import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { resource?: string; username?: string; action?: string; page?: number; pageSize?: number }) {
    const page     = Math.max(1, query.page     ?? 1);
    const pageSize = Math.min(100, query.pageSize ?? 25);
    const skip     = (page - 1) * pageSize;

    const where: Prisma.AuditLogWhereInput = {};
    if (query.resource) where.resource = { contains: query.resource, mode: 'insensitive' };
    if (query.username) where.username  = { contains: query.username, mode: 'insensitive' };
    if (query.action)   where.action    = { contains: query.action,   mode: 'insensitive' };

    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where, skip, take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }
}
