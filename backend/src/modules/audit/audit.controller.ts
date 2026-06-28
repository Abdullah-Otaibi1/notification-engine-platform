import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { QueryAuditDto } from './dto/query-audit.dto';

@ApiTags('Audit')
@ApiBearerAuth('access-token')
// Audit logs are sensitive — restricted to Admin and Auditor roles.
@Roles(Role.Admin, Role.Auditor)
@Controller({ path: 'notification-engine/audit', version: '1' })
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'Get audit logs' })
  findAll(@Query() q: QueryAuditDto) {
    return this.auditService.findAll({
      resource: q.resource,
      username: q.username,
      action:   q.action,
      page:     q.page,
      pageSize: q.pageSize,
    });
  }
}
