import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { WorkloadService } from './workload.service';

@ApiTags('Workload')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'notification-engine/workload', version: '1' })
export class WorkloadController {
  constructor(private readonly Service: WorkloadService) {}
  // TODO: implement Workload endpoints
}
