import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Channel, NotificationStatus, Prisma } from '@prisma/client';

export interface NotificationQuery {
  page?: number;
  pageSize?: number;
  status?: string;
  channel?: string;
  providerId?: string;
  requestId?: string;
  eventId?: string;
  messageId?: string;
  businessReference?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: NotificationQuery) {
    const page     = Math.max(1, query.page     ?? 1);
    const pageSize = Math.min(100, Math.max(1, query.pageSize ?? 20));
    const skip     = (page - 1) * pageSize;

    const where: Prisma.NotificationWhereInput = {};
    if (query.status)            where.status            = query.status as NotificationStatus;
    if (query.channel)           where.channel           = query.channel as Channel;
    if (query.providerId)        where.providerId        = query.providerId;
    if (query.requestId)         where.requestId         = { contains: query.requestId, mode: 'insensitive' };
    if (query.eventId)           where.eventId           = { contains: query.eventId,   mode: 'insensitive' };
    if (query.messageId)         where.messageId         = { contains: query.messageId, mode: 'insensitive' };
    if (query.businessReference) where.businessReference = { contains: query.businessReference, mode: 'insensitive' };

    const allowed = ['createdAt', 'updatedAt', 'status', 'channel', 'recipient'];
    const sortBy    = allowed.includes(query.sortBy ?? '') ? query.sortBy! : 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

    const [items, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true, notificationCode: true, eventId: true, requestId: true,
          messageId: true, businessReference: true, channel: true, status: true,
          recipient: true, createdAt: true, updatedAt: true, retryCount: true,
          provider:        { select: { id: true, name: true } },
          consumerChannel: { select: { id: true, name: true } },
        },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string) {
    const notification = await this.prisma.notification.findUniqueOrThrow({
      where: { id },
      include: {
        provider:        { select: { id: true, name: true, channel: true } },
        consumerChannel: { select: { id: true, name: true } },
        statusHistory:   { orderBy: { createdAt: 'asc' }, take: 100 },
        retryAttempts:   { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
    return notification;
  }
}
