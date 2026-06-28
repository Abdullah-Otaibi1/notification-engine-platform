import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationsService } from '../notifications.service';
import { NotificationDetail } from '../../../core/models/notification.model';
import { LoadingStateComponent } from '../../../shared';

@Component({
  selector: 'nep-notification-detail',
  standalone: true,
  imports: [
    CommonModule, DatePipe, MatCardModule, MatIconModule,
    MatButtonModule, MatDividerModule, MatTooltipModule,
    LoadingStateComponent,
  ],
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
    this.loading = true;
    this.error = '';
    this.svc.getOne(id).subscribe({
      next:  (data) => { this.notification = data; this.error = ''; this.loading = false; },
      error: (err)  => { this.notification = null; this.error = err?.error?.error?.message ?? 'Notification not found'; this.loading = false; },
    });
  }

  back() { this.router.navigate(['/notifications']); }

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

  tlDotClass(s: string): string {
    if (['NE_SUCCESS','NE_SENT'].includes(s))             return 'bg-emerald-500 border-emerald-200 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
    if (['NE_FAILED','NE_PARTIALLY_FAILED'].includes(s))  return 'bg-rose-500 border-rose-200 shadow-[0_0_8px_rgba(244,63,94,0.4)]';
    if (['NE_RETRY','NE_SENDING','NE_PROCESSING','NE_UNDER_PROCESSING','NE_ROUTED'].includes(s)) return 'bg-teal-500 border-teal-200 shadow-[0_0_8px_rgba(13,148,136,0.4)]';
    return 'bg-amber-500 border-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.4)]';
  }

  // timeline: if no history, show single item for current status
  get timeline() {
    const n = this.notification;
    if (!n) return [];
    if (n.statusHistory?.length) return n.statusHistory;
    return [{ id: n.id, status: n.status, message: null, createdAt: n.createdAt }];
  }
}
