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
