import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'notification-engine/notifications', version: '1' })
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Search notifications with filters and pagination' })
  @ApiQuery({ name: 'page',              required: false })
  @ApiQuery({ name: 'pageSize',          required: false })
  @ApiQuery({ name: 'status',            required: false })
  @ApiQuery({ name: 'channel',           required: false })
  @ApiQuery({ name: 'providerId',        required: false })
  @ApiQuery({ name: 'requestId',         required: false })
  @ApiQuery({ name: 'eventId',           required: false })
  @ApiQuery({ name: 'messageId',         required: false })
  @ApiQuery({ name: 'businessReference', required: false })
  @ApiQuery({ name: 'sortBy',            required: false })
  @ApiQuery({ name: 'sortOrder',         required: false })
  findAll(@Query() query: Record<string, string>) {
    return this.notificationsService.findAll({
      page:              parseInt(query['page']      ?? '1'),
      pageSize:          parseInt(query['pageSize']  ?? '20'),
      status:            query['status'],
      channel:           query['channel'],
      providerId:        query['providerId'],
      requestId:         query['requestId'],
      eventId:           query['eventId'],
      messageId:         query['messageId'],
      businessReference: query['businessReference'],
      sortBy:            query['sortBy'],
      sortOrder:         query['sortOrder'] as 'asc' | 'desc',
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification detail by ID' })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }
}
