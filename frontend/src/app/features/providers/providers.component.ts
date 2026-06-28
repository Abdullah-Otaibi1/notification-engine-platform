import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ProvidersService, Provider } from './providers.service';
import { PageHeaderComponent, LoadingStateComponent, EmptyStateComponent } from '../../shared';

@Component({
  selector: 'nep-providers',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatIconModule, MatTableModule,
    PageHeaderComponent, LoadingStateComponent, EmptyStateComponent,
  ],
  templateUrl: './providers.component.html',
  styleUrl: './providers.component.scss',
})
export class ProvidersComponent implements OnInit {
  private svc = inject(ProvidersService);
  loading = true; error = ''; providers: Provider[] = [];
  columns = ['name', 'channel', 'status', 'successRate', 'failureRate', 'throughput', 'avgLatencyMs'];

  private readonly CHIP_BASE = 'inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[10.5px] font-semibold whitespace-nowrap border tracking-wide';
  private readonly BADGE_BASE = 'inline-block px-2 py-[2px] rounded-md text-[10.5px] font-bold tracking-[0.06em] border';

  statusChipClass(s: string): string {
    const sl = s?.toLowerCase();
    if (sl === 'healthy')  return `${this.CHIP_BASE} bg-emerald-50 text-emerald-700 border-emerald-200`;
    if (sl === 'degraded') return `${this.CHIP_BASE} bg-amber-50 text-amber-700 border-amber-200`;
    if (sl === 'down')     return `${this.CHIP_BASE} bg-rose-50 text-rose-700 border-rose-200`;
    return `${this.CHIP_BASE} bg-slate-50 text-slate-500 border-slate-200`;
  }

  channelBadgeClass(c: string): string {
    const map: Record<string,string> = {
      sms:   `${this.BADGE_BASE} bg-sky-50 text-sky-700 border-sky-200`,
      email: `${this.BADGE_BASE} bg-teal-50 text-teal-700 border-teal-200`,
      push:  `${this.BADGE_BASE} bg-violet-50 text-violet-700 border-violet-200`,
    };
    return map[c?.toLowerCase()] ?? `${this.BADGE_BASE} bg-slate-50 text-slate-600 border-slate-200`;
  }

  ngOnInit() {
    this.loading = true;
    this.error = '';
    this.svc.getAll().subscribe({
      next:  (data) => { this.providers = data; this.error = ''; this.loading = false; },
      error: (err)  => { this.providers = []; this.error = err?.error?.error?.message ?? 'Failed to load providers'; this.loading = false; },
    });
  }
}
