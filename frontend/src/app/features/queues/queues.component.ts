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
