import { Routes } from '@angular/router';
import { TabsPage } from './pages';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/routes').then(m => m.routes),
      },
      {
        path: 'vehicles',
        loadChildren: () => import('../vehicles/routes').then(m => m.routes),
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/routes').then(m => m.routes),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
