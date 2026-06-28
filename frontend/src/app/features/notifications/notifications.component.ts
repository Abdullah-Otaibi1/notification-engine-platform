import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationsService } from './notifications.service';
import { NotificationRow, NotificationFilter } from '../../core/models/notification.model';
import { PageHeaderComponent, LoadingStateComponent, EmptyStateComponent } from '../../shared';

const STATUS_OPTIONS = [
  'NE_CREATED','NE_PROCESSING','NE_PROCESSED','NE_FAILED',
  'NE_SENDING','NE_SENT','NE_INITIALIZED','NE_UNDER_PROCESSING',
  'NE_ROUTED','NE_SUCCESS','NE_RETRY','NE_PARTIALLY_FAILED','NE_PENDING',
];
const CHANNEL_OPTIONS = ['SMS', 'EMAIL', 'PUSH'];

@Component({
  selector: 'nep-notifications',
  standalone: true,
  imports: [
    CommonModule, DatePipe, FormsModule,
    MatCardModule, MatTableModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatPaginatorModule, MatTooltipModule,
    PageHeaderComponent, LoadingStateComponent, EmptyStateComponent,
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent implements OnInit {
  private svc    = inject(NotificationsService);
  private router = inject(Router);

  loading = true; error = '';
  rows: NotificationRow[] = []; total = 0; page = 0; pageSize = 20;

  statusOptions  = STATUS_OPTIONS;
  channelOptions = CHANNEL_OPTIONS;

  filter: NotificationFilter = {};
  columns = ['id', 'notificationCode', 'eventId', 'requestId', 'consumerChannel', 'channel', 'status', 'recipient', 'createdAt'];

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.error = '';
    this.svc.search({ ...this.filter, page: this.page + 1, pageSize: this.pageSize }).subscribe({
      next:  (r) => { this.rows = r.items; this.total = r.total; this.error = ''; this.loading = false; },
      error: (err) => { this.rows = []; this.total = 0; this.error = err?.error?.error?.message ?? 'Failed to load notifications'; this.loading = false; },
    });
  }

  search() { this.page = 0; this.load(); }
  reset()  { this.filter = {}; this.search(); }
  onPage(e: PageEvent) { this.page = e.pageIndex; this.pageSize = e.pageSize; this.load(); }

  openDetail(row: NotificationRow) { this.router.navigate(['/notifications', row.id]); }

  private readonly CHIP_BASE = 'inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[10.5px] font-semibold whitespace-nowrap border tracking-wide';
  private readonly BADGE_BASE = 'inline-block px-2 py-[2px] rounded-md text-[10.5px] font-bold tracking-[0.06em] border';

  statusChipClass(s: string): string {
    if (['NE_SUCCESS','NE_SENT'].includes(s))             return `${this.CHIP_BASE} bg-emerald-50 text-emerald-700 border-emerald-200`;
    if (['NE_FAILED','NE_PARTIALLY_FAILED'].includes(s))  return `${this.CHIP_BASE} bg-rose-50 text-rose-700 border-rose-200`;
    if (['NE_RETRY','NE_SENDING','NE_PROCESSING','NE_UNDER_PROCESSING','NE_ROUTED'].includes(s)) return `${this.CHIP_BASE} bg-teal-50 text-teal-700 border-teal-200`;
    return `${this.CHIP_BASE} bg-amber-50 text-amber-700 border-amber-200`;
  }

  channelBadgeClass(c: string): string {
    const map: Record<string,string> = {
      sms:   `${this.BADGE_BASE} bg-sky-50 text-sky-700 border-sky-200`,
      email: `${this.BADGE_BASE} bg-teal-50 text-teal-700 border-teal-200`,
      push:  `${this.BADGE_BASE} bg-violet-50 text-violet-700 border-violet-200`,
    };
    return map[c.toLowerCase()] ?? `${this.BADGE_BASE} bg-slate-50 text-slate-600 border-slate-200`;
  }
}
