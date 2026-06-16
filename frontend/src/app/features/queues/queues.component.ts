import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QueuesService, Queue } from './queues.service';

@Component({
  selector: 'nep-queues',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './queues.component.html',
  styleUrl: './queues.component.scss',
})
export class QueuesComponent implements OnInit {
  private svc = inject(QueuesService);
  loading = true; error = ''; queues: Queue[] = [];
  columns = ['name', 'channel', 'currentDepth', 'capacity', 'fillPct', 'drainRate', 'oldestMessageMs', 'status'];

  ngOnInit() {
    this.svc.getAll().subscribe({
      next:  (data) => { this.queues = data; this.loading = false; },
      error: (err)  => { this.error = err?.error?.error?.message ?? 'Failed to load queues'; this.loading = false; },
    });
  }

  fillPct(q: Queue) { return q.capacity > 0 ? +((q.currentDepth / q.capacity) * 100).toFixed(1) : 0; }
  ageStr(ms: number) {
    if (ms < 1000) return ms + ' ms';
    if (ms < 60000) return (ms / 1000).toFixed(0) + ' s';
    return (ms / 60000).toFixed(1) + ' min';
  }
}
