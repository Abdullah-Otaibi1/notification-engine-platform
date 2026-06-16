import { Module } from '@nestjs/common';
import { ConsumerChannelsService } from './consumer-channels.service';
import { ConsumerChannelsController } from './consumer-channels.controller';

@Module({
  controllers: [ConsumerChannelsController],
  providers: [ConsumerChannelsService],
  exports: [ConsumerChannelsService],
})
export class ConsumerChannelsModule {}
