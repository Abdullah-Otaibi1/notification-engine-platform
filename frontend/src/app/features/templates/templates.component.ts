import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { TemplatesService, Template } from './templates.service';
import { PageHeaderComponent, LoadingStateComponent, EmptyStateComponent } from '../../shared';

@Component({
  selector: 'nep-templates',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatTableModule, MatIconModule,
    PageHeaderComponent, LoadingStateComponent, EmptyStateComponent,
  ],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss',
})
export class TemplatesComponent implements OnInit {
  private svc = inject(TemplatesService);
  loading = true; error = ''; templates: Template[] = [];
  columns = ['templateCode', 'notificationCode', 'eventCode', 'channel', 'language', 'isEnabled', 'retryCount'];

  private readonly BADGE_BASE = 'inline-block px-2 py-[2px] rounded-md text-[10.5px] font-bold tracking-[0.06em] border';

  channelBadgeClass(c: string): string {
    const map: Record<string,string> = {
      sms:   `${this.BADGE_BASE} bg-sky-50 text-sky-700 border-sky-200`,
      email: `${this.BADGE_BASE} bg-teal-50 text-teal-700 border-teal-200`,
      push:  `${this.BADGE_BASE} bg-violet-50 text-violet-700 border-violet-200`,
    };
    return map[c?.toLowerCase()] ?? `${this.BADGE_BASE} bg-slate-50 text-slate-600 border-slate-200`;
  }

  ngOnInit() {
    this.svc.getAll().subscribe({
      next:  (r) => { this.templates = r.items; this.loading = false; },
      error: (err) => { this.error = err?.error?.error?.message ?? 'Failed to load templates'; this.loading = false; },
    });
  }
}
