import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AlertsService } from './alerts.service';

@ApiTags('Alerts')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'notification-engine/alerts', version: '1' })
export class AlertsController {
  constructor(private readonly Service: AlertsService) {}
  // TODO: implement Alerts endpoints
}
