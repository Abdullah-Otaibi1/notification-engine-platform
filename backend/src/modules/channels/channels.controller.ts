import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChannelsService } from './channels.service';

@ApiTags('Channels')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'notification-engine/channels', version: '1' })
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get('health')
  @ApiOperation({ summary: 'Get channel health status for all channels' })
  getHealth() {
    return this.channelsService.getHealth();
  }
}
