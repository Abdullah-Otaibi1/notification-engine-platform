/**
 * Prisma Seed Script
 * Generates realistic demo data:
 *   - 4 default users (admin, ops, auditor, viewer)
 *   - Multiple providers (SMS/Email/Push)
 *   - Multiple consumer channels
 *   - Queue definitions
 *   - 10,000 notifications with status history
 *   - Templates
 *   - IDM configs
 *   - Alerts
 *   - SLA metrics
 *   - Audit logs
 *
 * Run: npx prisma db seed
 */

import { PrismaClient, Role, Channel, NotificationStatus, HealthStatus, AlertType, AlertSeverity, AlertStatus, QueueStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // These use upsert — always safe to re-run
  await seedUsers();
  await seedProviders();
  await seedConsumerChannels();
  await seedQueues();
  await seedTemplates();

  // These use create — guarded by count checks to skip on re-runs
  await seedIdmConfigs();
  await seedNotifications();
  await seedAlerts();
  await seedSlaMetrics();
  await seedWorkloadSnapshot();

  console.log('✅ Seed complete!');
}

// -----------------------------------------------
// Users
// -----------------------------------------------
async function seedUsers() {
  const users = [
    { username: 'admin',   displayName: 'System Admin',     email: 'admin@nep.local',   role: Role.Admin,      password: 'Admin@1234' },
    { username: 'ops',     displayName: 'Operations User',  email: 'ops@nep.local',     role: Role.Operations, password: 'Ops@1234' },
    { username: 'auditor', displayName: 'Audit User',       email: 'auditor@nep.local', role: Role.Auditor,    password: 'Auditor@1234' },
    { username: 'viewer',  displayName: 'Viewer User',      email: 'viewer@nep.local',  role: Role.Viewer,     password: 'Viewer@1234' },
  ];

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 12);
    await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: { username: u.username, passwordHash, displayName: u.displayName, email: u.email, role: u.role },
    });
  }
  console.log('  ✔ Users seeded');
}

// -----------------------------------------------
// Providers
// -----------------------------------------------
async function seedProviders() {
  const providers = [
    { name: 'Mobily SMS',   channel: Channel.SMS,   successRate: 98.5, avgLatencyMs: 320, status: HealthStatus.HEALTHY },
    { name: 'STC SMS',      channel: Channel.SMS,   successRate: 97.2, avgLatencyMs: 410, status: HealthStatus.HEALTHY },
    { name: 'Zain SMS',     channel: Channel.SMS,   successRate: 94.1, avgLatencyMs: 550, status: HealthStatus.DEGRADED },
    { name: 'SendGrid',     channel: Channel.EMAIL, successRate: 99.1, avgLatencyMs: 210, status: HealthStatus.HEALTHY },
    { name: 'AWS SES',      channel: Channel.EMAIL, successRate: 99.5, avgLatencyMs: 180, status: HealthStatus.HEALTHY },
    { name: 'Firebase FCM', channel: Channel.PUSH,  successRate: 96.3, avgLatencyMs: 150, status: HealthStatus.HEALTHY },
    { name: 'OneSignal',    channel: Channel.PUSH,  successRate: 93.8, avgLatencyMs: 200, status: HealthStatus.DEGRADED },
  ];

  for (const p of providers) {
    await prisma.provider.upsert({
      where: { name: p.name },
      update: {},
      create: {
        name: p.name,
        channel: p.channel,
        successRate: p.successRate,
        failureRate: 100 - p.successRate,
        avgLatencyMs: p.avgLatencyMs,
        status: p.status,
        throughput: Math.floor(Math.random() * 500) + 100,
      },
    });
  }
  console.log('  ✔ Providers seeded');
}

// -----------------------------------------------
// Consumer Channels
// -----------------------------------------------
async function seedConsumerChannels() {
  const channels = [
    { name: 'MOI-PORTAL',      isAuthorized: true },
    { name: 'NAFATH-APP',      isAuthorized: true },
    { name: 'ABSHER-PORTAL',   isAuthorized: true },
    { name: 'MUQEEM-SYSTEM',   isAuthorized: true },
    { name: 'EXTERNAL-VENDOR', isAuthorized: false, isBanned: true },
    { name: 'TEST-CHANNEL',    isAuthorized: true, smsSimulatorEnabled: true },
  ];

  for (const c of channels) {
    await prisma.consumerChannel.upsert({
      where: { name: c.name },
      update: {},
      create: { name: c.name, isAuthorized: c.isAuthorized ?? false, isBanned: c.isBanned ?? false, smsSimulatorEnabled: c.smsSimulatorEnabled ?? false },
    });
  }
  console.log('  ✔ Consumer channels seeded');
}

// -----------------------------------------------
// Queues
// -----------------------------------------------
async function seedQueues() {
  const queues = [
    { name: 'SMS_OUTBOUND_QUEUE',   channel: Channel.SMS,   capacity: 50000, currentDepth: 3200, status: QueueStatus.HEALTHY },
    { name: 'EMAIL_OUTBOUND_QUEUE', channel: Channel.EMAIL, capacity: 100000, currentDepth: 1200, status: QueueStatus.HEALTHY },
    { name: 'PUSH_OUTBOUND_QUEUE',  channel: Channel.PUSH,  capacity: 200000, currentDepth: 45000, status: QueueStatus.WARNING },
    { name: 'RETRY_QUEUE',          channel: null,          capacity: 10000, currentDepth: 850, status: QueueStatus.HEALTHY },
    { name: 'DLQ',                  channel: null,          capacity: 5000,  currentDepth: 4800, status: QueueStatus.CRITICAL },
  ];

  for (const q of queues) {
    await prisma.queue.upsert({
      where: { name: q.name },
      update: {},
      create: { name: q.name, channel: q.channel ?? undefined, capacity: q.capacity, currentDepth: q.currentDepth, drainRate: Math.random() * 100, oldestMessageMs: Math.floor(Math.random() * 60000), status: q.status },
    });
  }
  console.log('  ✔ Queues seeded');
}

// -----------------------------------------------
// Templates
// -----------------------------------------------
async function seedTemplates() {
  const templates = [
    { templateCode: 'OTP_SMS_AR',         notificationCode: 'OTP',      eventCode: 'LOGIN',         channel: Channel.SMS,   language: 'ar' },
    { templateCode: 'OTP_SMS_EN',         notificationCode: 'OTP',      eventCode: 'LOGIN',         channel: Channel.SMS,   language: 'en' },
    { templateCode: 'WELCOME_EMAIL_EN',   notificationCode: 'WELCOME',  eventCode: 'REGISTRATION',  channel: Channel.EMAIL, language: 'en' },
    { templateCode: 'WELCOME_EMAIL_AR',   notificationCode: 'WELCOME',  eventCode: 'REGISTRATION',  channel: Channel.EMAIL, language: 'ar' },
    { templateCode: 'ALERT_PUSH_EN',      notificationCode: 'ALERT',    eventCode: 'SYSTEM_ALERT',  channel: Channel.PUSH,  language: 'en' },
    { templateCode: 'PASSWORD_RESET_SMS', notificationCode: 'PWD_RESET', eventCode: 'PWD_RESET',    channel: Channel.SMS,   language: 'en' },
    { templateCode: 'RENEWAL_EMAIL_EN',   notificationCode: 'RENEWAL',  eventCode: 'EXPIRY_NOTICE', channel: Channel.EMAIL, language: 'en' },
  ];

  for (const t of templates) {
    await prisma.notificationTemplate.upsert({
      where: { templateCode: t.templateCode },
      update: {},
      create: { ...t, bodyTemplate: `Template body for ${t.templateCode}`, retryCount: 3 },
    });
  }
  console.log('  ✔ Templates seeded');
}

// -----------------------------------------------
// IDM Configs
// -----------------------------------------------
async function seedIdmConfigs() {
  const existing = await prisma.idmContactConfig.count();
  if (existing > 0) {
    console.log('  ⏭ IDM configs already exist, skipping');
    return;
  }

  const configs = [
    { govAgency: 'MOI',  vrpCode: 'VRP001', roleName: 'RESIDENT_OFFICER', sector: 'GOVERNMENT' },
    { govAgency: 'MOJ',  vrpCode: 'VRP002', roleName: 'LEGAL_OFFICER',    sector: 'GOVERNMENT' },
    { govAgency: null,   vrpCode: null,      roleName: 'VENDOR_AGENT',     sector: 'PRIVATE', vendorId: 'VND-001' },
    { govAgency: 'MISA', vrpCode: 'VRP003', roleName: 'INVESTOR_OFFICER',  sector: 'GOVERNMENT' },
  ];

  for (const c of configs) {
    await prisma.idmContactConfig.create({ data: { ...c } });
  }
  console.log('  ✔ IDM configs seeded');
}

// -----------------------------------------------
// Notifications (10,000 records)
// -----------------------------------------------
async function seedNotifications() {
  const existing = await prisma.notification.count();
  if (existing > 0) {
    console.log(`  ⏭ Notifications already exist (${existing} records), skipping`);
    return;
  }

  const allProviders = await prisma.provider.findMany();
  const allChannels  = await prisma.consumerChannel.findMany();
  const statuses     = Object.values(NotificationStatus);
  const channels     = Object.values(Channel);
  const BATCH_SIZE   = 500;
  const TOTAL        = 10000;

  const recipients = ['966500000001','966500000002','user@example.com','966500000003','push-token-abc'];

  for (let batch = 0; batch < TOTAL / BATCH_SIZE; batch++) {
    const data = Array.from({ length: BATCH_SIZE }, (_, i) => {
      const idx      = batch * BATCH_SIZE + i;
      const channel  = channels[idx % channels.length];
      const status   = statuses[Math.floor(Math.random() * statuses.length)];
      const provider = allProviders.filter(p => p.channel === channel)[0];
      const consumer = allChannels[idx % allChannels.length];
      const daysAgo  = Math.floor(Math.random() * 90);
      const createdAt = new Date(Date.now() - daysAgo * 86400000 - Math.random() * 86400000);

      return {
        id: uuidv4(),
        notificationCode: `NOTIF_${String(idx).padStart(5, '0')}`,
        eventId: `EVT-${uuidv4().split('-')[0].toUpperCase()}`,
        requestId: `REQ-${uuidv4().split('-')[0].toUpperCase()}`,
        messageId: `MSG-${uuidv4().split('-')[0].toUpperCase()}`,
        businessReference: `BR-${String(idx).padStart(6, '0')}`,
        channel,
        status,
        recipient: recipients[idx % recipients.length],
        providerId: provider?.id ?? null,
        consumerChannelId: consumer?.id ?? null,
        retryCount: status === NotificationStatus.NE_RETRY ? Math.floor(Math.random() * 3) + 1 : 0,
        createdAt,
        updatedAt: createdAt,
        sentAt: (([NotificationStatus.NE_SENT, NotificationStatus.NE_SUCCESS] as NotificationStatus[]).includes(status)) ? new Date(createdAt.getTime() + 2000) : null,
      };
    });

    await prisma.notification.createMany({ data, skipDuplicates: true });
    process.stdout.write(`\r  ↳ Notifications: ${(batch + 1) * BATCH_SIZE} / ${TOTAL}`);
  }
  console.log('\n  ✔ Notifications seeded');
}

// -----------------------------------------------
// Alerts
// -----------------------------------------------
async function seedAlerts() {
  const existing = await prisma.alert.count();
  if (existing > 0) {
    console.log('  ⏭ Alerts already exist, skipping');
    return;
  }

  const alerts = [
    { type: AlertType.QUEUE_BACKLOG,  severity: AlertSeverity.CRITICAL, source: 'DLQ',       message: 'Dead letter queue capacity at 96%', status: AlertStatus.ACTIVE },
    { type: AlertType.PROVIDER_DOWN,  severity: AlertSeverity.HIGH,     source: 'Zain SMS',   message: 'Provider Zain SMS is not responding', status: AlertStatus.ACKNOWLEDGED },
    { type: AlertType.SLA_BREACH,     severity: AlertSeverity.HIGH,     source: 'SMS Channel', message: 'SMS channel SLA breach: P99 > 5000ms', status: AlertStatus.ACTIVE },
    { type: AlertType.ERROR_SPIKE,    severity: AlertSeverity.MEDIUM,   source: 'OneSignal',  message: 'Push notification error rate spiked to 12%', status: AlertStatus.ACTIVE },
    { type: AlertType.QUEUE_BACKLOG,  severity: AlertSeverity.MEDIUM,   source: 'PUSH_OUTBOUND_QUEUE', message: 'Push queue depth at 45,000', status: AlertStatus.SILENCED },
  ];

  for (const a of alerts) {
    await prisma.alert.create({ data: a });
  }
  console.log('  ✔ Alerts seeded');
}

// -----------------------------------------------
// SLA Metrics
// -----------------------------------------------
async function seedSlaMetrics() {
  const existing = await prisma.slaMetric.count();
  if (existing > 0) {
    console.log('  ⏭ SLA metrics already exist, skipping');
    return;
  }

  const now = new Date();
  for (let i = 0; i < 30; i++) {
    const periodStart = new Date(now.getTime() - (i + 1) * 86400000);
    const periodEnd   = new Date(now.getTime() - i * 86400000);
    await prisma.slaMetric.create({
      data: {
        periodStart,
        periodEnd,
        compliance:   95 + Math.random() * 5,
        p50LatencyMs: 150 + Math.random() * 100,
        p90LatencyMs: 400 + Math.random() * 200,
        p95LatencyMs: 800 + Math.random() * 300,
        p99LatencyMs: 2000 + Math.random() * 1500,
        totalCount:   Math.floor(5000 + Math.random() * 3000),
        successCount: Math.floor(4800 + Math.random() * 200),
        failureCount: Math.floor(Math.random() * 200),
      },
    });
  }
  console.log('  ✔ SLA metrics seeded');
}

// -----------------------------------------------
// Workload Snapshot
// -----------------------------------------------
async function seedWorkloadSnapshot() {
  const existing = await prisma.workloadSnapshot.count();
  if (existing > 0) {
    console.log('  ⏭ Workload snapshot already exists, skipping');
    return;
  }

  await prisma.workloadSnapshot.create({
    data: {
      activeInstances: 8,
      maxInstances: 250,
      cpuUsage: 42.5,
      memoryUsage: 61.3,
      queuePressure: 38.7,
    },
  });
  console.log('  ✔ Workload snapshot seeded');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
