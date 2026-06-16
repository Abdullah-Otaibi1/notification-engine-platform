import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ConsumerChannelsService } from './consumer-channels.service';

@ApiTags('Consumer Channels')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'notification-engine/consumer-channels', version: '1' })
export class ConsumerChannelsController {
  constructor(private readonly Service: ConsumerChannelsService) {}
  // TODO: implement ConsumerChannels endpoints
}
