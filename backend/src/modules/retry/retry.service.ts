import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RetryService {
  constructor(private prisma: PrismaService) {}
  // TODO: implement Retry service methods
}
