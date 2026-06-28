import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChannelsService, ChannelHealth } from './channels.service';
import { PageHeaderComponent, LoadingStateComponent, EmptyStateComponent } from '../../shared';

@Component({
  selector: 'nep-channels',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatIconModule, MatTooltipModule,
    PageHeaderComponent, LoadingStateComponent, EmptyStateComponent,
  ],
  templateUrl: './channels.component.html',
  styleUrl: './channels.component.scss',
})
export class ChannelsComponent implements OnInit {
  private svc = inject(ChannelsService);
  loading = true; error = ''; channels: ChannelHealth[] = [];

  channelIcon: Record<string, string> = { SMS: 'sms', EMAIL: 'email', PUSH: 'notifications_active' };

  private readonly CHIP_BASE = 'inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[10.5px] font-semibold whitespace-nowrap border tracking-wide';

  statusChipClass(s: string): string {
    const sl = s?.toLowerCase();
    if (sl === 'healthy')  return `${this.CHIP_BASE} bg-emerald-50 text-emerald-700 border-emerald-200`;
    if (sl === 'degraded') return `${this.CHIP_BASE} bg-amber-50 text-amber-700 border-amber-200`;
    if (sl === 'down')     return `${this.CHIP_BASE} bg-rose-50 text-rose-700 border-rose-200`;
    return `${this.CHIP_BASE} bg-slate-50 text-slate-500 border-slate-200`;
  }

  ngOnInit() {
    this.loading = true;
    this.error = '';
    this.svc.getHealth().subscribe({
      next:  (data) => { this.channels = data; this.error = ''; this.loading = false; },
      error: (err)  => { this.channels = []; this.error = err?.error?.error?.message ?? 'Failed to load channel health'; this.loading = false; },
    });
  }
}
