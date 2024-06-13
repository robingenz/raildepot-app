import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./domains/tabs/routes').then(m => m.routes),
  },
];
