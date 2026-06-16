import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuditService } from './audit.service';

@ApiTags('Audit')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'notification-engine/audit', version: '1' })
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'Get audit logs' })
  findAll(@Query() q: Record<string, string>) {
    return this.auditService.findAll({
      resource: q['resource'],
      username: q['username'],
      action:   q['action'],
      page:     parseInt(q['page']     ?? '1'),
      pageSize: parseInt(q['pageSize'] ?? '25'),
    });
  }
}
