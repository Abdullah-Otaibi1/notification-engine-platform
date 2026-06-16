import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IdmService } from './idm.service';

@ApiTags('IDM')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'notification-engine/idm', version: '1' })
export class IdmController {
  constructor(private readonly Service: IdmService) {}
  // TODO: implement Idm endpoints
}
