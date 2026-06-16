import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TemplatesService } from './templates.service';

@ApiTags('Templates')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'notification-engine/templates', version: '1' })
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  @ApiOperation({ summary: 'List notification templates' })
  findAll(@Query() q: Record<string, string>) {
    return this.templatesService.findAll({
      channel:   q['channel'],
      isEnabled: q['isEnabled'],
      page:      parseInt(q['page'] ?? '1'),
      pageSize:  parseInt(q['pageSize'] ?? '50'),
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get template by ID' })
  findOne(@Param('id') id: string) {
    return this.templatesService.findOne(id);
  }
}
