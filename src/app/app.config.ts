import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
} from '@angular/core';
import {
  PreloadAllModules,
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  withRouterConfig,
} from '@angular/router';

import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { TranslocoModule } from '@app/widgets/transloco';
import { IonicRouteStrategy } from '@ionic/angular';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideQueryClientOptions } from '@ngneat/query';
import { AuthInterceptor, ErrorHandlerService } from './core';
import { routes } from './routes';
import { getModeForIonicModule } from './store';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule, TranslocoModule),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
    provideIonicAngular({
      mode: getModeForIonicModule(),
      backButtonDefaultHref: '/',
    }),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withRouterConfig({
        /**
         * @see https://github.com/angular/angular/issues/13586
         */
        canceledNavigationResolution: 'computed',
      }),
    ),
    provideQueryClientOptions({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: false,
          throwOnError: true,
        },
      },
    }),
  ],
};
