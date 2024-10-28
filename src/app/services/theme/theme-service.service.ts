import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDark = false;

  toggleTheme(): void {
    this.isDark = !this.isDark;
    document.documentElement.setAttribute(
      'data-theme',
      this.isDark ? 'dark' : 'light'
    );
  }

  isDarkThemeActive(): boolean {
    return this.isDark;
  }

  getToggleLabel(): string {
    return this.isDark ? 'Switch to light theme' : 'Switch to dark theme';
  }
}
