import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WorkloadService {
  constructor(private prisma: PrismaService) {}
  // TODO: implement Workload service methods
}
