import { Component, Input } from '@angular/core';

@Component({
  selector: 'nep-page-header',
  standalone: true,
  imports: [],
  template: `
    <div class="flex items-start justify-between mb-7 gap-4">
      <div>
        <h1 class="m-0 text-[22px] font-extrabold text-slate-900 tracking-tight leading-tight">{{ title }}</h1>
        @if (subtitle) {
          <p class="mt-1 m-0 text-[13px] text-slate-500 font-medium">{{ subtitle }}</p>
        }
      </div>
      <div class="flex items-center gap-2 shrink-0 mt-1">
        <ng-content />
      </div>
    </div>
  `,
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
}
