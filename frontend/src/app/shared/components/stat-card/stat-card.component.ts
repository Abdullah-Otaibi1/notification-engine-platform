import { Component, Input } from '@angular/core';
import { NgStyle, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'nep-stat-card',
  standalone: true,
  imports: [NgStyle, DecimalPipe, MatIconModule],
  template: `
    <div class="group relative bg-white rounded-2xl overflow-hidden border border-slate-100
                flex flex-col cursor-default select-none
                transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:border-slate-200"
         style="box-shadow: 0 1px 2px rgba(15,23,42,0.04), 0 6px 24px rgba(15,23,42,0.06)">
      <!-- Colored top strip -->
      <div class="h-[3px] w-full shrink-0" [style.background]="'linear-gradient(to right,' + color + ',' + color + 'aa)'"></div>
      <!-- Body -->
      <div class="p-5 flex items-start gap-4 flex-1">
        <!-- Icon circle -->
        <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
             [ngStyle]="{ background: color + '14' }">
          <mat-icon class="!text-[22px] !w-[22px] !h-[22px] transition-colors" [style.color]="color">{{ icon }}</mat-icon>
        </div>
        <!-- Number + label -->
        <div class="flex-1 min-w-0 pt-0.5">
          <div class="font-['DM_Sans'] text-[28px] font-extrabold text-slate-900 tracking-tight leading-none tabular-nums">
            {{ value | number:'1.0-1' }}<span class="text-lg font-bold" [style.color]="color">{{ suffix }}</span>
          </div>
          <div class="mt-1.5 text-[11.5px] font-semibold text-slate-400 tracking-wide uppercase">{{ label }}</div>
        </div>
      </div>
    </div>
  `,
})
export class StatCardComponent {
  @Input() icon = 'analytics';
  @Input() label = '';
  @Input() value: number = 0;
  @Input() suffix = '';
  @Input() color = '#0d9488';
}
