import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExampleIframeComponent, FlexLayoutComponent } from './pages';

export const routes: Routes = [
  { path: '', component: ExampleIframeComponent },
  { path: 'flex', component: FlexLayoutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
