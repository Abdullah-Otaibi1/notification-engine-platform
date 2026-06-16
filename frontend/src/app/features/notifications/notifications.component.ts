import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationsService } from './notifications.service';
import { NotificationRow, NotificationFilter } from '../../core/models/notification.model';

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
    MatCardModule, MatTableModule, MatIconModule, MatProgressSpinnerModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatChipsModule, MatPaginatorModule, MatTooltipModule,
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
    this.svc.search({ ...this.filter, page: this.page + 1, pageSize: this.pageSize }).subscribe({
      next:  (r) => { this.rows = r.items; this.total = r.total; this.loading = false; },
      error: (err) => { this.error = err?.error?.error?.message ?? 'Failed to load notifications'; this.loading = false; },
    });
  }

  search() { this.page = 0; this.load(); }
  reset()  { this.filter = {}; this.search(); }
  onPage(e: PageEvent) { this.page = e.pageIndex; this.pageSize = e.pageSize; this.load(); }

  openDetail(row: NotificationRow) { this.router.navigate(['/notifications', row.id]); }

  statusClass(s: string) {
    if (['NE_SUCCESS','NE_SENT'].includes(s))             return 'success';
    if (['NE_FAILED','NE_PARTIALLY_FAILED'].includes(s))  return 'failure';
    if (['NE_RETRY','NE_SENDING','NE_PROCESSING','NE_UNDER_PROCESSING','NE_ROUTED'].includes(s)) return 'inflight';
    return 'pending';
  }
}
