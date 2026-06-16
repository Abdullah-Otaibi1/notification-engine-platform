import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'nep_theme';
  readonly mode = signal<ThemeMode>(this.loadTheme());

  constructor() {
    effect(() => {
      const theme = this.mode();
      document.body.classList.toggle('dark-theme', theme === 'dark');
      localStorage.setItem(this.STORAGE_KEY, theme);
    });
  }

  toggle() {
    this.mode.update((m) => (m === 'light' ? 'dark' : 'light'));
  }

  private loadTheme(): ThemeMode {
    const stored = localStorage.getItem(this.STORAGE_KEY) as ThemeMode;
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
