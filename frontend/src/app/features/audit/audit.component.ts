import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AuditService, AuditLog } from './audit.service';
import { PageHeaderComponent, LoadingStateComponent, EmptyStateComponent } from '../../shared';

@Component({
  selector: 'nep-audit',
  standalone: true,
  imports: [
    CommonModule, DatePipe, FormsModule,
    MatCardModule, MatTableModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatPaginatorModule,
    PageHeaderComponent, LoadingStateComponent, EmptyStateComponent,
  ],
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.scss',
})
export class AuditComponent implements OnInit {
  private svc = inject(AuditService);
  loading = true; error = '';
  logs: AuditLog[] = []; total = 0; page = 0; pageSize = 25;
  columns = ['createdAt', 'username', 'action', 'resource', 'resourceId', 'reason'];

  filter = { username: '', action: '', resource: '' };

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.error = '';
    this.svc.getAll({ ...this.filter, page: this.page + 1, pageSize: this.pageSize }).subscribe({
      next:  (r) => { this.logs = r.items; this.total = r.total; this.error = ''; this.loading = false; },
      error: (err) => { this.logs = []; this.total = 0; this.error = err?.error?.error?.message ?? 'Failed to load audit logs'; this.loading = false; },
    });
  }

  search() { this.page = 0; this.load(); }
  resetFilter() { this.filter = { username: '', action: '', resource: '' }; this.search(); }
  onPage(e: PageEvent) { this.page = e.pageIndex; this.pageSize = e.pageSize; this.load(); }
}
