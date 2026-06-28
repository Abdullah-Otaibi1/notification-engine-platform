import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'nep-loading-state',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="loading-center">
      <mat-spinner [diameter]="diameter" />
      <span>{{ message }}</span>
    </div>
  `,
})
export class LoadingStateComponent {
  @Input() diameter = 40;
  @Input() message = 'Loading…';
}
