import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/mat-tabs/mat-tabs').then((m) => m.MatTabs),
  },
  {
    path: 'toolbar',
    loadComponent: () => import('./pages/mat-toolbar/mat-toolbar').then((m) => m.MatToolbar),
  },
];
