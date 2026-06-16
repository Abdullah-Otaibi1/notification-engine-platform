import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ChannelsModule } from './modules/channels/channels.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { IdmModule } from './modules/idm/idm.module';
import { QueuesModule } from './modules/queues/queues.module';
import { ConsumerChannelsModule } from './modules/consumer-channels/consumer-channels.module';
import { RetryModule } from './modules/retry/retry.module';
import { WorkloadModule } from './modules/workload/workload.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { SlaModule } from './modules/sla/sla.module';
import { AuditModule } from './modules/audit/audit.module';
import { ReportsModule } from './modules/reports/reports.module';
import { EsbModule } from './esb/esb.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 300 }]),
    PrismaModule,
    EsbModule,
    AuthModule,
    DashboardModule,
    ChannelsModule,
    ProvidersModule,
    NotificationsModule,
    TemplatesModule,
    IdmModule,
    QueuesModule,
    ConsumerChannelsModule,
    RetryModule,
    WorkloadModule,
    AlertsModule,
    SlaModule,
    AuditModule,
    ReportsModule,
  ],
})
export class AppModule {}
