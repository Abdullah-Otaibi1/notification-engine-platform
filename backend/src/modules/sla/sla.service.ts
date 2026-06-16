import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SlaService {
  constructor(private prisma: PrismaService) {}
  // TODO: implement Sla service methods
}
