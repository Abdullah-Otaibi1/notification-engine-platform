import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ConsumerChannelsService {
  constructor(private prisma: PrismaService) {}
  // TODO: implement ConsumerChannels service methods
}
