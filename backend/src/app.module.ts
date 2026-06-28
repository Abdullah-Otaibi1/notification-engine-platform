import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { validateEnv } from './common/config/env.validation';
import { HealthController } from './health/health.controller';
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
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', validate: validateEnv }),
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
  controllers: [HealthController],
  providers: [
    // Order matters: throttle first, then authenticate, then authorize.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
