import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatTabsComponent } from './components/mat-tabs/mat-tabs.component';
import { MatToolbarComponent } from './components/mat-toolbar/mat-toolbar.component';

export const routes: Routes = [
  { path: '', component: MatTabsComponent },
  { path: 'toolbar', component: MatToolbarComponent },
];

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'example-angular-app';
}
