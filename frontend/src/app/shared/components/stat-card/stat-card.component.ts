import { Component, Input } from '@angular/core';
import { NgStyle, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'nep-stat-card',
  standalone: true,
  imports: [NgStyle, DecimalPipe, MatIconModule],
  template: `
    <div class="kpi-card" [style.--accent]="color">
      <div class="kpi-accent-line" [style.background]="color"></div>
      <div class="kpi-icon" [ngStyle]="{ background: color + '18', color: color }">
        <mat-icon>{{ icon }}</mat-icon>
      </div>
      <div class="kpi-body">
        <div class="kpi-value">{{ value | number:'1.0-1' }}{{ suffix }}</div>
        <div class="kpi-label">{{ label }}</div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .kpi-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      box-shadow: var(--card-shadow);
      padding: 18px 20px 16px;
      display: flex;
      align-items: flex-start;
      gap: 14px;
      position: relative;
      overflow: hidden;
      transition: box-shadow 0.2s, transform 0.15s;
      &:hover {
        box-shadow: var(--card-hover);
        transform: translateY(-1px);
      }
    }
    .kpi-accent-line {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      opacity: 0.8;
    }
    .kpi-icon {
      width: 44px; height: 44px;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      mat-icon { font-size: 22px; width: 22px; height: 22px; }
    }
    .kpi-body { flex: 1; min-width: 0; padding-top: 2px; }
    .kpi-value {
      font-size: 26px; font-weight: 800;
      color: var(--text); letter-spacing: -0.5px; line-height: 1.1;
    }
    .kpi-label {
      font-size: 12px; color: var(--text-3);
      margin-top: 4px; font-weight: 500; letter-spacing: 0.02em;
    }
  `],
})
export class StatCardComponent {
  @Input() icon = 'analytics';
  @Input() label = '';
  @Input() value: number = 0;
  @Input() suffix = '';
  @Input() color = '#2563eb';
}
