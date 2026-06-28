import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';

interface NavItem { label: string; icon: string; route: string; preview?: boolean; }

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',          icon: 'dashboard',           route: '/dashboard' },
  { label: 'Channel Health',     icon: 'monitor_heart',       route: '/channels' },
  { label: 'Providers',          icon: 'hub',                 route: '/providers' },
  { label: 'Notifications',      icon: 'notifications',       route: '/notifications' },
  { label: 'Templates',          icon: 'description',         route: '/templates' },
  { label: 'IDM Config',         icon: 'manage_accounts',     route: '/idm',               preview: true },
  { label: 'Queues',             icon: 'queue',               route: '/queues' },
  { label: 'Consumer Channels',  icon: 'device_hub',          route: '/consumer-channels', preview: true },
  { label: 'Retry & Recovery',   icon: 'replay',              route: '/retry',             preview: true },
  { label: 'Workload',           icon: 'memory',              route: '/workload',          preview: true },
  { label: 'Alerts',             icon: 'warning_amber',       route: '/alerts',            preview: true },
  { label: 'SLA Monitoring',     icon: 'speed',               route: '/sla',               preview: true },
  { label: 'Audit Logs',         icon: 'policy',              route: '/audit' },
  { label: 'Reports',            icon: 'bar_chart',           route: '/reports',           preview: true },
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

  theme  = inject(ThemeService);
  auth   = inject(AuthService);
  private bp = inject(BreakpointObserver);

  isMobile = toSignal(
    this.bp.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(r => r.matches)),
    { initialValue: false },
  );

  sidenavOpen = signal(true);

  toggleSidenav() { this.sidenavOpen.update(v => !v); }

  closeSidenavOnMobile() {
    if (this.isMobile()) this.sidenavOpen.set(false);
  }

  roleColor = computed(() => ROLE_COLORS[this.auth.role() ?? ''] ?? '#78909c');
}
