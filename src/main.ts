import { I18nService } from './app/services/i18n.service';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAppInitializer, inject } from '@angular/core';

import { App } from './app/app';
import { appConfig } from './app/app.config';
import { routes } from './app/app.routes';
import { firebaseProviders } from './app/firebase.config';

import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { register } from 'swiper/element/bundle';

import { getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

register();

// Initialize Firebase Analytics only in supported browser environments
isSupported().then((supported) => {
  if (supported) {
    try {
      const app = getApp();
      getAnalytics(app);
      console.log('Firebase Analytics initialized');
    } catch (error) {
      console.error('Firebase Analytics init failed:', error);
    }
  }
});

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),

    provideRouter(routes),
    provideHttpClient(),

    provideTranslateService({
      lang: 'mk',
      fallbackLang: 'mk',
    }),
    provideTranslateHttpLoader({
      prefix: '/assets/i18n/',
      suffix: '.json',
    }),

    provideAppInitializer(() => {
      const i18n = inject(I18nService);
      i18n.init('mk');
    }),

    ...firebaseProviders,
  ],
}).catch(err => console.error(err));