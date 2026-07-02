import { Routes } from '@angular/router';
import { MatTabs } from './components/mat-tabs/mat-tabs';
import { MatToolbar } from './components/mat-toolbar/mat-toolbar';

export const routes: Routes = [
  { path: '', component: MatTabs },
  { path: 'toolbar', component: MatToolbar },
];
