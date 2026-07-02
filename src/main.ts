import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { AppComponent, routes } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideAnimationsAsync()],
})
  .catch(console.error)
  .finally(() => console.log('Application bootstrapped'));
