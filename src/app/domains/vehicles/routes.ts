import { Routes } from '@angular/router';
import { canDeactivateGuard, leavePageGuard } from '@app/core';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/vehicle-list-page/vehicle-list-page.component').then(
        m => m.VehicleListPageComponent,
      ),
    canDeactivate: [leavePageGuard],
  },
  {
    path: 'create',
    loadComponent: () =>
      import(
        './components/vehicle-upsert-page/vehicle-upsert-page.component'
      ).then(m => m.VehicleUpsertPageComponent),
    canDeactivate: [canDeactivateGuard, leavePageGuard],
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        './components/vehicle-upsert-page/vehicle-upsert-page.component'
      ).then(m => m.VehicleUpsertPageComponent),
    canDeactivate: [canDeactivateGuard, leavePageGuard],
  },
];
