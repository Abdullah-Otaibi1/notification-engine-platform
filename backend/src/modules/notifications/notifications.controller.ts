import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { QueryNotificationsDto } from './dto/query-notifications.dto';

@ApiTags('Notifications')
@ApiBearerAuth('access-token')
@Controller({ path: 'notification-engine/notifications', version: '1' })
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Search notifications with filters and pagination' })
  findAll(@Query() query: QueryNotificationsDto) {
    return this.notificationsService.findAll({
      page:              query.page,
      pageSize:          query.pageSize,
      status:            query.status,
      channel:           query.channel,
      providerId:        query.providerId,
      requestId:         query.requestId,
      eventId:           query.eventId,
      messageId:         query.messageId,
      businessReference: query.businessReference,
      sortBy:            query.sortBy,
      sortOrder:         query.sortOrder,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification detail by ID' })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }
}
