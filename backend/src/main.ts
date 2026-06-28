import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const port = configService.get<number>('PORT', 3000);

  // CORS: default to the local dev frontend; accept a comma-separated allow-list.
  // Only reflect any origin when explicitly set to '*' (opt-in, not the default).
  const corsOriginRaw = configService.get<string>('CORS_ORIGIN', 'http://localhost:4200');
  const corsOrigins = corsOriginRaw.split(',').map((o) => o.trim()).filter(Boolean);

  // Security
  app.use(helmet());
  app.use(compression());

  // Free in-flight requests / DB connections on SIGTERM/SIGINT.
  app.enableShutdownHooks();

  // CORS
  app.enableCors({
    origin: corsOrigins.includes('*') ? true : corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Global prefix & versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global filters & interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor(), new LoggingInterceptor());

  // Swagger — disabled in production to avoid exposing the full API surface.
  if (nodeEnv !== 'production') {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Notification Engine Operations Platform')
    .setDescription('REST API documentation for the Notification Engine Operations & Monitoring Platform')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'access-token',
    )
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Dashboard', 'Dashboard KPIs and charts')
    .addTag('Channels', 'Channel health monitoring')
    .addTag('Providers', 'Provider monitoring and management')
    .addTag('Notifications', 'Notification search and details')
    .addTag('Templates', 'Template management')
    .addTag('IDM', 'IDM contact configuration')
    .addTag('Queues', 'Queue monitoring')
    .addTag('Consumer Channels', 'Consumer channel management')
    .addTag('Retry', 'Retry & recovery operations')
    .addTag('Workload', 'Workload management')
    .addTag('Alerts', 'Alerts & incident management')
    .addTag('SLA', 'SLA monitoring')
    .addTag('Audit', 'Audit logs')
    .addTag('Reports', 'Reports generation')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
  }

  await app.listen(port);
  console.log(`\n🚀 Application is running on: http://localhost:${port}`);
  if (nodeEnv !== 'production') {
    console.log(`📚 Swagger UI:               http://localhost:${port}/api/docs`);
  }
  console.log(`❤️  Health check:             http://localhost:${port}/api/health`);
  console.log(`🔗 API base path:             http://localhost:${port}/api/v1/notification-engine\n`);
}

bootstrap().catch((err) => {
  console.error('Fatal error during bootstrap:', err);
  process.exit(1);
});
