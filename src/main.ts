/* eslint-disable unicorn/prefer-top-level-await */
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '@app/app.component';
import { appConfig } from '@app/app.config';
import { enableElfProdMode } from '@ngneat/elf';
import { devTools } from '@ngneat/elf-devtools';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  enableElfProdMode();
} else {
  devTools();
}

bootstrapApplication(AppComponent, appConfig).catch(error =>
  console.log(error),
);
