import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ProvidersService, Provider } from './providers.service';
import { PageHeaderComponent, LoadingStateComponent, EmptyStateComponent } from '../../shared';

@Component({
  selector: 'nep-providers',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatIconModule, MatTableModule,
    PageHeaderComponent, LoadingStateComponent, EmptyStateComponent,
  ],
  templateUrl: './providers.component.html',
  styleUrl: './providers.component.scss',
})
export class ProvidersComponent implements OnInit {
  private svc = inject(ProvidersService);
  loading = true; error = ''; providers: Provider[] = [];
  columns = ['name', 'channel', 'status', 'successRate', 'failureRate', 'throughput', 'avgLatencyMs'];

  ngOnInit() {
    this.loading = true;
    this.error = '';
    this.svc.getAll().subscribe({
      next:  (data) => { this.providers = data; this.error = ''; this.loading = false; },
      error: (err)  => { this.providers = []; this.error = err?.error?.error?.message ?? 'Failed to load providers'; this.loading = false; },
    });
  }
}
