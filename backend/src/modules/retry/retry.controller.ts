import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RetryService } from './retry.service';

@ApiTags('Retry')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'notification-engine/retry', version: '1' })
export class RetryController {
  constructor(private readonly Service: RetryService) {}
  // TODO: implement Retry endpoints
}
