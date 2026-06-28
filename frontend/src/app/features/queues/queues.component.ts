import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { QueuesService, Queue } from './queues.service';
import { PageHeaderComponent, LoadingStateComponent, EmptyStateComponent } from '../../shared';

@Component({
  selector: 'nep-queues',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatTableModule, MatIconModule,
    PageHeaderComponent, LoadingStateComponent, EmptyStateComponent,
  ],
  templateUrl: './queues.component.html',
  styleUrl: './queues.component.scss',
})
export class QueuesComponent implements OnInit {
  private svc = inject(QueuesService);
  loading = true; error = ''; queues: Queue[] = [];
  columns = ['name', 'channel', 'depthCapacity', 'fillPct', 'drainRate', 'oldestMessage', 'status'];

  private readonly CHIP_BASE = 'inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[10.5px] font-semibold whitespace-nowrap border tracking-wide';
  private readonly BADGE_BASE = 'inline-block px-2 py-[2px] rounded-md text-[10.5px] font-bold tracking-[0.06em] border';

  statusChipClass(s: string): string {
    const sl = s?.toLowerCase();
    if (sl === 'healthy')  return `${this.CHIP_BASE} bg-emerald-50 text-emerald-700 border-emerald-200`;
    if (sl === 'warning')  return `${this.CHIP_BASE} bg-amber-50 text-amber-700 border-amber-200`;
    if (sl === 'critical') return `${this.CHIP_BASE} bg-rose-50 text-rose-700 border-rose-200`;
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
      next:  (data) => { this.queues = data; this.error = ''; this.loading = false; },
      error: (err)  => { this.queues = []; this.error = err?.error?.error?.message ?? 'Failed to load queues'; this.loading = false; },
    });
  }

  fillPct(q: Queue) { return q.capacity > 0 ? +((q.currentDepth / q.capacity) * 100).toFixed(1) : 0; }
  ageStr(ms: number) {
    if (ms < 1000) return ms + ' ms';
    if (ms < 60000) return (ms / 1000).toFixed(0) + ' s';
    return (ms / 60000).toFixed(1) + ' min';
  }
}
