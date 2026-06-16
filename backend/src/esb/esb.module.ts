import { Module } from '@nestjs/common';
import { EsbService } from './esb.service';

/**
 * Mock ESB (Enterprise Service Bus) module.
 * Replace EsbService implementation with real ESB HTTP calls when ready.
 */
@Module({
  providers: [EsbService],
  exports: [EsbService],
})
export class EsbModule {}
