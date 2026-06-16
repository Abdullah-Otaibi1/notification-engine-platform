import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SlaService } from './sla.service';

@ApiTags('SLA')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'notification-engine/sla', version: '1' })
export class SlaController {
  constructor(private readonly Service: SlaService) {}
  // TODO: implement Sla endpoints
}
