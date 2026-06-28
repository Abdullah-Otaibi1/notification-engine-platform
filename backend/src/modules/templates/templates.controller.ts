import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TemplatesService } from './templates.service';
import { QueryTemplatesDto } from './dto/query-templates.dto';

@ApiTags('Templates')
@ApiBearerAuth('access-token')
@Controller({ path: 'notification-engine/templates', version: '1' })
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  @ApiOperation({ summary: 'List notification templates' })
  findAll(@Query() q: QueryTemplatesDto) {
    return this.templatesService.findAll({
      channel:   q.channel,
      isEnabled: q.isEnabled,
      page:      q.page,
      pageSize:  q.pageSize,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get template by ID' })
  findOne(@Param('id') id: string) {
    return this.templatesService.findOne(id);
  }
}
