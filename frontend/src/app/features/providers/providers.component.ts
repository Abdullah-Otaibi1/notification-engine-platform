import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { ProvidersService, Provider } from './providers.service';

@Component({
  selector: 'nep-providers',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatTableModule, MatChipsModule],
  templateUrl: './providers.component.html',
  styleUrl: './providers.component.scss',
})
export class ProvidersComponent implements OnInit {
  private svc = inject(ProvidersService);
  loading = true; error = ''; providers: Provider[] = [];
  columns = ['name', 'channel', 'status', 'successRate', 'failureRate', 'throughput', 'avgLatencyMs'];

  ngOnInit() {
    this.svc.getAll().subscribe({
      next:  (data) => { this.providers = data; this.loading = false; },
      error: (err)  => { this.error = err?.error?.error?.message ?? 'Failed to load providers'; this.loading = false; },
    });
  }
}
