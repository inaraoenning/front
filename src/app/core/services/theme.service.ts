// Fluxo: API retorna cor HEX → applyCorEmpresa() → hexToOklchString() → CSS variables no :root

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'theme';
  private themeSubject = new BehaviorSubject<string>(this.getSavedTheme()); // BehaviorSubject inicializado com o tema salvo no localStorage
  theme$ = this.themeSubject.asObservable(); // Observable público que os componentes assinam para reagir a mudanças de tema

  private getSavedTheme(): string {
    return localStorage.getItem(this.THEME_KEY) || 'retro';
  }

  // Salva no localStorage, aplica o data-theme no DOM e emite o novo valor no subject
  setTheme(theme: string): void {
    localStorage.setItem(this.THEME_KEY, theme); // Chave usada no localStorage para persistir a preferência
    document.documentElement.setAttribute('data-theme', theme);
    this.themeSubject.next(theme);
  }

  initTheme(): void {
    const theme = this.getSavedTheme();
    document.documentElement.setAttribute('data-theme', theme);
  }

  get currentTheme(): string {
    return this.themeSubject.value;
  }

  readonly themes = ['retro'];
}
