import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { NotificationsService } from '../notifications.service';
import { NotificationDetail } from '../../../core/models/notification.model';

@Component({
  selector: 'nep-notification-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, MatCardModule, MatIconModule,
    MatProgressSpinnerModule, MatButtonModule, MatChipsModule, MatDividerModule],
  templateUrl: './notification-detail.component.html',
  styleUrl: './notification-detail.component.scss',
})
export class NotificationDetailComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private svc    = inject(NotificationsService);

  loading = true; error = '';
  notification: NotificationDetail | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.svc.getOne(id).subscribe({
      next:  (data) => { this.notification = data; this.loading = false; },
      error: (err)  => { this.error = err?.error?.error?.message ?? 'Notification not found'; this.loading = false; },
    });
  }

  back() { this.router.navigate(['/notifications']); }

  statusClass(s: string) {
    if (['NE_SUCCESS','NE_SENT'].includes(s))             return 'success';
    if (['NE_FAILED','NE_PARTIALLY_FAILED'].includes(s))  return 'failure';
    return 'inflight';
  }

  // timeline: if no history, show single item for current status
  get timeline() {
    const n = this.notification;
    if (!n) return [];
    if (n.statusHistory?.length) return n.statusHistory;
    return [{ id: n.id, status: n.status, message: null, createdAt: n.createdAt }];
  }
}
