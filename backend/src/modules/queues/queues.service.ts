import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class QueuesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.queue.findMany({ orderBy: { name: 'asc' } });
  }
}
