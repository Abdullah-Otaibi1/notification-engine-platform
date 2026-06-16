import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';

interface NavItem { label: string; icon: string; route: string; }

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',          icon: 'dashboard',           route: '/dashboard' },
  { label: 'Channel Health',     icon: 'monitor_heart',       route: '/channels' },
  { label: 'Providers',          icon: 'hub',                 route: '/providers' },
  { label: 'Notifications',      icon: 'notifications',       route: '/notifications' },
  { label: 'Templates',          icon: 'description',         route: '/templates' },
  { label: 'IDM Config',         icon: 'manage_accounts',     route: '/idm' },
  { label: 'Queues',             icon: 'queue',               route: '/queues' },
  { label: 'Consumer Channels',  icon: 'device_hub',          route: '/consumer-channels' },
  { label: 'Retry & Recovery',   icon: 'replay',              route: '/retry' },
  { label: 'Workload',           icon: 'memory',              route: '/workload' },
  { label: 'Alerts',             icon: 'warning_amber',       route: '/alerts' },
  { label: 'SLA Monitoring',     icon: 'speed',               route: '/sla' },
  { label: 'Audit Logs',         icon: 'policy',              route: '/audit' },
  { label: 'Reports',            icon: 'bar_chart',           route: '/reports' },
];

const ROLE_COLORS: Record<string, string> = {
  Admin: '#e91e63', Operations: '#1976d2', Auditor: '#43a047', Viewer: '#fb8c00',
};

@Component({
  selector: 'nep-shell',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    MatSidenavModule, MatToolbarModule, MatListModule,
    MatIconModule, MatButtonModule, MatTooltipModule, MatChipsModule,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  readonly navItems = NAV_ITEMS;

  theme = inject(ThemeService);
  auth  = inject(AuthService);

  roleColor = computed(() => ROLE_COLORS[this.auth.role() ?? ''] ?? '#78909c');
}
