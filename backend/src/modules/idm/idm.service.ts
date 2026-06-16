import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IdmService {
  constructor(private prisma: PrismaService) {}
  // TODO: implement Idm service methods
}
