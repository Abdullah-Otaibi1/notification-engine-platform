import { Module } from '@nestjs/common';
import { RetryService } from './retry.service';
import { RetryController } from './retry.controller';

@Module({
  controllers: [RetryController],
  providers: [RetryService],
  exports: [RetryService],
})
export class RetryModule {}
