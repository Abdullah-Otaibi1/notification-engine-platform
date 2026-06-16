import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { TemplatesService, Template } from './templates.service';

@Component({
  selector: 'nep-templates',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, MatProgressSpinnerModule, MatChipsModule],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss',
})
export class TemplatesComponent implements OnInit {
  private svc = inject(TemplatesService);
  loading = true; error = ''; templates: Template[] = [];
  columns = ['templateCode', 'notificationCode', 'eventCode', 'channel', 'language', 'isEnabled', 'retryCount'];

  ngOnInit() {
    this.svc.getAll().subscribe({
      next:  (r) => { this.templates = r.items; this.loading = false; },
      error: (err) => { this.error = err?.error?.error?.message ?? 'Failed to load templates'; this.loading = false; },
    });
  }
}
