import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExampleIframeComponent } from './pages/example-iframe/example-iframe.component';

export const routes: Routes = [{ path: '', component: ExampleIframeComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
