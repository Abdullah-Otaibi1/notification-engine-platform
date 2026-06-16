import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        title: 'Dashboard',
      },
      {
        path: 'channels',
        loadComponent: () => import('./features/channels/channels.component').then((m) => m.ChannelsComponent),
        title: 'Channel Health',
      },
      {
        path: 'providers',
        loadComponent: () => import('./features/providers/providers.component').then((m) => m.ProvidersComponent),
        title: 'Provider Monitoring',
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications/notifications.component').then((m) => m.NotificationsComponent),
        title: 'Notification Search',
      },
      {
        path: 'notifications/:id',
        loadComponent: () => import('./features/notifications/notification-detail/notification-detail.component').then((m) => m.NotificationDetailComponent),
        title: 'Notification Details',
      },
      {
        path: 'templates',
        loadComponent: () => import('./features/templates/templates.component').then((m) => m.TemplatesComponent),
        title: 'Templates',
      },
      {
        path: 'idm',
        loadComponent: () => import('./features/idm/idm.component').then((m) => m.IdmComponent),
        title: 'IDM Configuration',
      },
      {
        path: 'queues',
        loadComponent: () => import('./features/queues/queues.component').then((m) => m.QueuesComponent),
        title: 'Queue Monitoring',
      },
      {
        path: 'consumer-channels',
        loadComponent: () => import('./features/consumer-channels/consumer-channels.component').then((m) => m.ConsumerChannelsComponent),
        title: 'Consumer Channels',
      },
      {
        path: 'retry',
        loadComponent: () => import('./features/retry/retry.component').then((m) => m.RetryComponent),
        title: 'Retry & Recovery',
      },
      {
        path: 'workload',
        loadComponent: () => import('./features/workload/workload.component').then((m) => m.WorkloadComponent),
        title: 'Workload Management',
      },
      {
        path: 'alerts',
        loadComponent: () => import('./features/alerts/alerts.component').then((m) => m.AlertsComponent),
        title: 'Alerts',
      },
      {
        path: 'sla',
        loadComponent: () => import('./features/sla/sla.component').then((m) => m.SlaComponent),
        title: 'SLA Monitoring',
      },
      {
        path: 'audit',
        loadComponent: () => import('./features/audit/audit.component').then((m) => m.AuditComponent),
        title: 'Audit Logs',
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/reports.component').then((m) => m.ReportsComponent),
        title: 'Reports',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
