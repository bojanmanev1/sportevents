import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class I18nService {
  constructor(private translate: TranslateService) {}

  init(defaultLang: 'mk' | 'en' = 'mk') {
    const saved = (localStorage.getItem('lang') as 'mk' | 'en') || defaultLang;
    this.translate.setDefaultLang(defaultLang);
    this.translate.use(saved);
    document.documentElement.lang = saved;
  }

  get current(): 'mk' | 'en' {
    return (this.translate.currentLang as 'mk' | 'en') || 'mk';
  }

  use(lang: 'mk' | 'en') {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }

  toggle() {
    this.use(this.current === 'mk' ? 'en' : 'mk');
  }

  key(text: string, prefix?: string): string {
    if (!text) return '';

    const normalized = text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^\p{L}\p{N}]/gu, '');

    return prefix ? `${prefix}.${normalized}` : normalized;
  }

  instant(text: string, prefix?: string): string {
    const key = this.key(text, prefix);
    return this.translate.instant(key);
  }
}