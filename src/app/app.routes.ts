import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/shell/shell').then((m) => m.Shell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'mat-table' },
      {
        path: 'mat-table',
        loadComponent: () => import('./pages/mat-table/mat-table').then((m) => m.MatTable),
      },
      {
        path: 'iframe-resizer',
        loadComponent: () =>
          import('./pages/iframe-resizer/iframe-resizer').then((m) => m.IframeResizer),
      },
      // The navigation layout used to be a route (`/toolbar`), so old links land on the default
      // page instead of an empty outlet.
      { path: '**', redirectTo: 'mat-table' },
    ],
  },
];
