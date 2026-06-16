import { Module } from '@nestjs/common';
import { IdmService } from './idm.service';
import { IdmController } from './idm.controller';

@Module({
  controllers: [IdmController],
  providers: [IdmService],
  exports: [IdmService],
})
export class IdmModule {}
