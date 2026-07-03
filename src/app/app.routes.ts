import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/mat-tabs/mat-tabs').then((m) => m.MatTabs),
  },
  {
    path: 'toolbar',
    loadComponent: () => import('./components/mat-toolbar/mat-toolbar').then((m) => m.MatToolbar),
  },
];
