import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'nep-loading-state',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="flex flex-col items-center justify-center py-20 gap-5">
      <mat-spinner [diameter]="diameter" />
      <span class="text-sm font-medium text-slate-400 tracking-wide">{{ message }}</span>
    </div>
  `,
})
export class LoadingStateComponent {
  @Input() diameter = 40;
  @Input() message = 'Loading…';
}
