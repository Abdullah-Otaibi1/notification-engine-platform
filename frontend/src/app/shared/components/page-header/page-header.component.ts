import { Component, Input } from '@angular/core';

@Component({
  selector: 'nep-page-header',
  standalone: true,
  imports: [],
  template: `
    <div class="page-header">
      <div class="ph-main">
        <h1>{{ title }}</h1>
        @if (subtitle) { <p>{{ subtitle }}</p> }
      </div>
      <div class="ph-actions">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 24px;
      gap: 16px;
    }
    h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      color: var(--text);
      letter-spacing: -0.3px;
    }
    p { margin: 2px 0 0; font-size: 13px; color: var(--text-3); }
    .ph-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
      margin-top: 4px;
    }
  `],
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
}
