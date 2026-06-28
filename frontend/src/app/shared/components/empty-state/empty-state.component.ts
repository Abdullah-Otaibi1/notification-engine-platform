import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'nep-empty-state',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div class="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
      <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-1">
        <mat-icon class="!text-[28px] !w-7 !h-7 text-slate-400">{{ icon }}</mat-icon>
      </div>
      <p class="m-0 text-[14px] font-semibold text-slate-500">{{ message }}</p>
      @if (actionLabel) {
        <button mat-stroked-button color="primary" (click)="action.emit()" class="mt-1">
          {{ actionLabel }}
        </button>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() message = 'No data found.';
  @Input() actionLabel = '';
  @Output() action = new EventEmitter<void>();
}
